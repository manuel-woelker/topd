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

use std::collections::HashMap;
use std::io::Write;
use std::thread::sleep;

use libc::{c_char,c_int,size_t};
use std::time::Duration;
use std::iter::repeat;
use std::io::{Error,ErrorKind,Result};
use serde_json::value::to_value;
extern {
    pub fn gethostname(name: *mut c_char, size: size_t) -> c_int;
}

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
        loop {
            try!(write!(res, "event: metrics\ndata: "));
            let mut result = HashMap::new();
            let mut loadavg_map = HashMap::new();
            let loadavg = procinfo::loadavg().unwrap();
            loadavg_map.insert("load_avg_1_min", loadavg.load_avg_1_min);
            loadavg_map.insert("load_avg_5_min", loadavg.load_avg_5_min);
            loadavg_map.insert("load_avg_10_min", loadavg.load_avg_10_min);
            result.insert("loadavg", to_value(&loadavg_map));
            result.insert("timestamp", to_value(&time::get_time().sec));

            serde_json::to_writer(res, &result).unwrap();
            try!(write!(res, "\n\n"));
            try!(res.flush());
            sleep(Duration::from_secs(1));
        }
    }
}

unsafe impl Send for MetricsEventStream {}

fn main() {
    println!("Listening on http://localhost:3000/");

    let mut mount = Mount::new();
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
    Iron::new(mount).http("localhost:3000").unwrap();

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
