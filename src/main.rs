#![allow(dead_code)]
#[macro_use]
extern crate procinfo;

extern crate serde;
extern crate num_cpus;
extern crate serde_json;

extern crate libc;
extern crate iron;
extern crate mount;
#[macro_use]
extern crate mime;
extern crate time;

use iron::prelude::*;
use iron::response::{ResponseBody, WriteBody};
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
use std::io::{Error,ErrorKind,Result};
use serde_json::value::to_value;

pub mod sensors;

use sensors::cpu::CpuSensor;
use sensors::memory::MemorySensor;
use sensors::net::NetSensor;

extern {
    pub fn gethostname(name: *mut c_char, size: size_t) -> c_int;
}

const INDEX_HTML:&'static str = include_str!("../ui/src/index.html");
const BUNDLE_JS:&'static str = include_str!("../ui/target/dist/bundle.js");

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
    fn write_body(&mut self, res: &mut ResponseBody) -> Result<()> {
        let mut cpu_sensor = CpuSensor::new();
        let memory_sensor = MemorySensor::new();
        let mut net_sensor = NetSensor::new();
        loop {
            let start_time = PreciseTime::now();
            try!(write!(res, "event: metrics\ndata: "));
            let mut result = HashMap::new();
            let mut loadavg_map = HashMap::new();
            let loadavg = procinfo::loadavg().unwrap();
            loadavg_map.insert("load_avg_1_min", loadavg.load_avg_1_min);
            loadavg_map.insert("load_avg_5_min", loadavg.load_avg_5_min);
            loadavg_map.insert("load_avg_10_min", loadavg.load_avg_10_min);
            result.insert("loadavg", to_value(&loadavg_map));
            result.insert("timestamp", to_value(&time::get_time().sec));
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
                result.insert("cpu_usage", to_value(&usage_map));
            }

            if let Some(memory_usage) = memory_sensor.measure() {
                let mut usage_map = HashMap::new();
                usage_map.insert("used", memory_usage.used);
                usage_map.insert("buffers", memory_usage.buffers);
                usage_map.insert("cache", memory_usage.cache);
                usage_map.insert("swap", memory_usage.swap);
                result.insert("memory_usage", to_value(&usage_map));
            }
            if let Some(net_usage) = net_sensor.measure() {
                let mut usage_map = HashMap::new();
                usage_map.insert("recv", net_usage.recv);
                usage_map.insert("send", net_usage.send);
                result.insert("net_usage", to_value(&usage_map));
            }


            serde_json::to_writer(res, &result).unwrap();
            try!(write!(res, "\n\n"));
            try!(res.flush());
            let end_time = PreciseTime::now();
            let time_to_sleep = cmp::max(100, 500-start_time.to(end_time).num_milliseconds());
            sleep(Duration::from_millis(time_to_sleep as u64));
        }
    }
}

unsafe impl Send for MetricsEventStream {}

fn main() {
    println!("Listening on http://localhost:3000/");

    let mut mount = Mount::new();
    mount.mount("/bundle.js", |_: &mut Request| {
        Ok(Response::with((status::Ok, mime!(Text/Html), BUNDLE_JS)))
    });
    mount.mount("/api/system-metrics-events", |_: &mut Request| {
        let stream = MetricsEventStream;
        let boxed_stream: Box<WriteBody + Send> = Box::new(stream);
        let response = Response::with((status::Ok, mime!(Text/EventStream), boxed_stream));
        Ok(response)
    });

    mount.mount("/api/system-info", |_: &mut Request| {
        let mut result = HashMap::new();
        result.insert("numberOfCpus", to_value(&num_cpus::get()));
        let _ = hostname().map(|hostname| result.insert("hostname", to_value(&hostname)));
        let result = serde_json::to_string(&result).unwrap();

        Ok(Response::with((status::Ok, mime!(Application/Json), result)))
    });
    mount.mount("/", |_: &mut Request| {
        Ok(Response::with((status::Ok, mime!(Text/Html), INDEX_HTML)))
    });
    Iron::new(mount).http("0.0.0.0:3000").unwrap();

/*	let mut server = Nickel::new();
	let mut router = Nickel::router();

	router.get("/api/system-info", middleware! { |_, mut response|
		response.set(MediaType::Json);
		let mut result = HashMap::new();
		result.insert("numberOfCpus", to_value(&num_cpus::get()));
		let _ = hostname().map(|hostname| result.insert("hostname", to_value(&hostname)));
		serde_json::to_string(&result).unwrap()
	});

	router.get("/api/system-metrics", middleware! { |_, mut response|
		response.set(MediaType::Json);
		let loadavg = procinfo::loadavg().unwrap();
		let mut result = HashMap::new();
		let mut loadavg_map = HashMap::new();
		loadavg_map.insert("load_avg_1_min", loadavg.load_avg_1_min);
		loadavg_map.insert("load_avg_5_min", loadavg.load_avg_5_min);
		loadavg_map.insert("load_avg_10_min", loadavg.load_avg_10_min);
		result.insert("loadavg", loadavg_map);
		serde_json::to_string(&result).unwrap()
	});

	server.utilize(router);
	server.utilize(StaticFilesHandler::new("target/doc/"));
//	  server.get("**", middleware!("Hello World"));
	server.listen("127.0.0.1:3000");
	println!("Listening on http://localhost:3000/");
    */
}
