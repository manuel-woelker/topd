
use time::{PreciseTime};
use std::io;
use std::io::prelude::*;
use std::fs::File;
use std::collections::HashMap;

pub struct DiskSensor {
	last_measurement_time: PreciseTime ,
	last_measurement: HashMap<String, u64>,
}

impl DiskSensor {
	pub fn new() -> DiskSensor {
		DiskSensor { last_measurement_time: PreciseTime::now(), last_measurement: HashMap::new()}
	}

	pub fn measure(&mut self) -> HashMap<String, f32> {
		let now = PreciseTime::now();
		let elapsed_time_in_s = self.last_measurement_time.to(now).num_milliseconds() as f32 / 1000.0;
		self.last_measurement_time = now;

		let file = File::open("/proc/diskstats").unwrap();
		let mut reader = io::BufReader::new(file);
		let mut result = HashMap::new();
		loop {
			let mut line = String::new();
			if let Ok(_) = reader.read_line(&mut line) {
				if line.len() == 0 {
					break;
				}
				let current_measurement: Vec<&str> = line.split_whitespace().collect();
				if current_measurement[0] == "8" && current_measurement[1] == "0" {
					let disk_name = current_measurement[2].to_owned();
					let current_value = u64::from_str_radix(current_measurement[13], 10).unwrap();
					if let Some(&last_value) = self.last_measurement.get(&disk_name) {
						let delta = current_value - last_value;
						result.insert(disk_name.clone(), delta as f32/elapsed_time_in_s/1000.0);
					}
					self.last_measurement.insert(disk_name, current_value);
				}
			} else {
				break;
			}
		}
		result
	}
}
