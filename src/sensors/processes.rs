use libc;

use time::{PreciseTime};
use std::io;
use std::fs;
use std::io::prelude::*;
use std::fs::File;

use std::collections::HashMap;

pub struct ProcessesSensor {
	last_measurement_time: PreciseTime,
	clock_ticks_per_second: f64,
	page_size: u64,
	last_measurement: HashMap<u64, ProcessValue>
}

#[derive(Default, Debug)]
pub struct ProcessValue {
	ttime: f64,
}

#[derive(Default, Debug)]
pub struct ProcessInfo {
	pub pid: u64,
	pub cpu: f64,
	pub rss: u64,
	pub cmd: String,
}

impl ProcessesSensor {
	pub fn new() -> ProcessesSensor {
		let clock_ticks_per_second;
		let page_size;
		unsafe {
			clock_ticks_per_second = libc::sysconf(libc::_SC_CLK_TCK) as f64;
			page_size = libc::sysconf(libc::_SC_PAGE_SIZE) as u64;
		}
		ProcessesSensor { last_measurement_time: PreciseTime::now(), clock_ticks_per_second: clock_ticks_per_second, page_size: page_size, last_measurement: Default::default()}
	}

	pub fn measure(&mut self) -> Vec<ProcessInfo> {
		let now = PreciseTime::now();
		let elapsed_time_in_s = self.last_measurement_time.to(now).num_milliseconds() as f64 / 1000.0;
		self.last_measurement_time = now;
		let mut result: Vec<ProcessInfo> = Default::default();
		for entry in fs::read_dir("/proc").unwrap() {
			let entry = entry.unwrap();
			let file_name = entry.file_name().to_str().unwrap().to_string();
			if let Ok(pid) = file_name.parse::<u64>() {
				if let Ok(file) = File::open(format!("/proc/{}/stat", file_name)) {
					let mut reader = io::BufReader::new(file);
					let mut line = String::new();
					if reader.read_line(&mut line).is_ok() {
						let cmd_start = line.find("(").expect("(");
						let cmd_end = line.rfind(")").unwrap();
						let cmd = &line[cmd_start+1..cmd_end];
						let line = &line[cmd_end+2..];
						let current_measurement: Vec<&str> = line.split_whitespace().collect();
						let mut process_info: ProcessInfo = Default::default();
						process_info.pid = pid;
						process_info.rss = current_measurement[21].parse::<u64>().unwrap() * self.page_size;
						let ttime = (current_measurement[11].parse::<u64>().unwrap() + current_measurement[12].parse::<u64>().unwrap()) as f64 / self.clock_ticks_per_second;
						if let Some(ref last_measurement) = self.last_measurement.get(&pid) {
								let usage = (ttime - last_measurement.ttime)/elapsed_time_in_s;
								process_info.cpu = usage;
						}
						self.last_measurement.insert(pid, ProcessValue {ttime: ttime});
						process_info.cmd = cmd.to_string();
						result.push(process_info);
					}
				}
			}
        }
		return result;
	}
}
