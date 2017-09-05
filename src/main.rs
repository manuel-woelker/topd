#![allow(dead_code)]
extern crate procinfo;

#[macro_use]
extern crate serde_derive;
extern crate serde;
#[macro_use]
extern crate serde_json;

extern crate num_cpus;

extern crate libc;
extern crate iron;
extern crate mount;

#[macro_use]
extern crate mime;
extern crate time;
extern crate toml;

use iron::Iron;
use iron::request::{Request};
use iron::response::{Response, WriteBody};
use iron::status;
use mount::Mount;

use time::{PreciseTime};

use std::collections::HashMap;
use std::io::Write;
use std::thread::sleep;

use libc::{c_char,c_int,size_t};
use std::iter::repeat;
use std::time::Duration;
use std::cmp;
use std::io::{Read, Error,ErrorKind,Result};
use std::fs::File;

pub mod sensors;

use sensors::cpu::CpuSensor;
use sensors::memory::MemorySensor;
use sensors::net::NetSensor;
use sensors::disk::DiskSensor;
use sensors::processes::ProcessesSensor;
extern {
    pub fn gethostname(name: *mut c_char, size: size_t) -> c_int;
}

const INDEX_HTML:&'static str = include_str!("../ui/src/index.html");
const BUNDLE_JS:&'static str = include_str!("assets/bundle.js");

const VERSION: Option<&'static str> = option_env!("CARGO_PKG_VERSION");
/// Calls `gethostname`
pub fn hostname() -> Result<String> {
    // Create a buffer for the hostname to be copied into
    let buffer_len: usize = 255;
    let mut buffer: Vec<u8> = repeat(0).take(buffer_len).collect();

    let error = unsafe {
        gethostname(buffer.as_mut_ptr() as *mut c_char, buffer_len as size_t)
    };

    if error != 0 {
        return Err(Error::last_os_error());
    }

    // Find the end of the string and truncate the vector to that length
    let len = buffer.iter().position(|b| *b == 0).unwrap_or(buffer_len);
    buffer.truncate(len);

    // Create an owned string from the buffer, transforming UTF-8 errors into IO errors
    String::from_utf8(buffer).map_err(|e| Error::new(ErrorKind::Other, e))
}

struct MetricsEventStream;

impl WriteBody for MetricsEventStream {
    fn write_body(&mut self, mut res: &mut Write) -> Result<()> {
        let mut cpu_sensor = CpuSensor::new();
        let memory_sensor = MemorySensor::new();
        let mut net_sensor = NetSensor::new();
        let mut disk_sensor = DiskSensor::new();
        let mut processes_sensor = ProcessesSensor::new();
        let mut iteration_counter = 0u64;
        loop {
            let start_time = PreciseTime::now();
            try!(write!(res, "event: metrics\ndata: "));
            let mut result = HashMap::new();
            let mut loadavg_map = HashMap::new();
            let loadavg = procinfo::loadavg().unwrap();
            loadavg_map.insert("load_avg_1_min", loadavg.load_avg_1_min);
            loadavg_map.insert("load_avg_5_min", loadavg.load_avg_5_min);
            loadavg_map.insert("load_avg_10_min", loadavg.load_avg_10_min);
            result.insert("loadavg", json!(&loadavg_map));
            result.insert("timestamp", json!(&time::get_time().sec));
            if let Some(cpu_usage) = cpu_sensor.measure() {
                let mut usage_map = HashMap::new();
                usage_map.insert("user", cpu_usage[0]);
                usage_map.insert("nice", cpu_usage[1]);
                usage_map.insert("system", cpu_usage[2]);
                usage_map.insert("idle", cpu_usage[3]);
                usage_map.insert("iowait", cpu_usage[4]);
                usage_map.insert("irq", cpu_usage[5]);
                usage_map.insert("softirq", cpu_usage[6]);
                usage_map.insert("steal", cpu_usage[7]);
                usage_map.insert("guest", cpu_usage[8]);
                usage_map.insert("guest_nice", cpu_usage[9]);
                result.insert("cpu_usage", json!(&usage_map));
            }

            if let Some(memory_usage) = memory_sensor.measure() {
                let mut usage_map = HashMap::new();
                usage_map.insert("used", memory_usage.used);
                usage_map.insert("buffers", memory_usage.buffers);
                usage_map.insert("cache", memory_usage.cache);
                usage_map.insert("swap", memory_usage.swap);
                result.insert("memory_usage", json!(&usage_map));
            }
            if let Some(net_usage) = net_sensor.measure() {
                let mut usage_map = HashMap::new();
                usage_map.insert("recv", net_usage.recv);
                usage_map.insert("send", net_usage.send);
                result.insert("net_usage", json!(&usage_map));
            }
            let disk_usage = disk_sensor.measure();
            result.insert("disk_usage", json!(&disk_usage));
            if iteration_counter % 10 == 0 {
                let processes = processes_sensor.measure();
                let mut process_list = Vec::new();
                for process in processes {
                    let mut map = HashMap::new();
                    map.insert("pid", json!(process.pid));
                    map.insert("cpu", json!(&process.cpu));
                    map.insert("rss", json!(&process.rss));
                    map.insert("cmd", json!(&process.cmd));
                    if let Some(cmdline) = process.cmdline {
                        map.insert("cmdline", json!(&cmdline));                        
                    }
                    process_list.push(map);
                }
                result.insert("processes", json!(&process_list));
            }

            serde_json::to_writer(&mut res, &result).unwrap();
            try!(write!(res, "\n\n"));
            try!(res.flush());
            let end_time = PreciseTime::now();
            let time_to_sleep = cmp::max(100, 500-start_time.to(end_time).num_milliseconds());
            sleep(Duration::from_millis(time_to_sleep as u64));
            iteration_counter+=1;
        }
    }
}

unsafe impl Send for MetricsEventStream {}


fn default_port() -> u16 {
	3000
}
#[derive(Deserialize)]
struct Config {
	#[serde(default = "default_port")]
	port: u16,
}


fn main() {
    let mut port = 3000;
    let config_file = File::open("topd.toml");
    if config_file.is_ok() {
        let mut config_content = String::new();
    	config_file.unwrap().read_to_string(&mut config_content).unwrap();
    	let config: Config = toml::from_str(&config_content).unwrap();
		port = config.port;
    }

    println!("topd v{}", VERSION.unwrap_or("?"));
    println!("Listening on http://localhost:{}/", port);

    let mut mount = Mount::new();
    mount.mount("/bundle.js", |_: &mut Request| {
        Ok(Response::with((status::Ok, mime!(Text/Html), BUNDLE_JS)))
    });
    mount.mount("/api/system-metrics-events", |_: &mut Request| {
        let stream = MetricsEventStream;
        let boxed_stream: Box<WriteBody + 'static> = Box::new(stream);
		let response = Response::with((status::Ok, mime!(Text/EventStream), boxed_stream));
        Ok(response)
    });

    mount.mount("/api/system-info", |_: &mut Request| {
        let mut result = HashMap::new();
        result.insert("numberOfCpus", json!(&num_cpus::get()));
        let _ = hostname().map(|hostname| result.insert("hostname", json!(&hostname)));
        result.insert("version", json!(&VERSION.unwrap_or("unknown")));
        let result = serde_json::to_string(&result).unwrap();

        Ok(Response::with((status::Ok, mime!(Application/Json), result)))
    });
    mount.mount("/", |_: &mut Request| {
        Ok(Response::with((status::Ok, mime!(Text/Html), INDEX_HTML)))
    });
    Iron::new(mount).http(("::", port)).unwrap();

}
