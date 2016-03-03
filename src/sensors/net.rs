
use time::{PreciseTime};
use std::io;
use std::io::prelude::*;
use std::fs::File;

pub struct NetSensor {
	last_measurement_time: PreciseTime ,
	last_measurement_recv: u64,
	last_measurement_send: u64,
}

#[derive(Debug)]
pub struct NetworkUsage {
	pub recv: f32,
	pub send: f32,
}

impl NetSensor {
	pub fn new() -> NetSensor {
		NetSensor { last_measurement_time: PreciseTime::now(), last_measurement_recv: 0, last_measurement_send: 0}
	}

	pub fn measure(&mut self) -> Option<NetworkUsage> {
		let now = PreciseTime::now();
		let file = File::open("/proc/net/dev").unwrap();
		let mut reader = io::BufReader::new(file);
		let mut temp_line = String::new();
		// skip two lines
		reader.read_line(&mut temp_line).unwrap();
		reader.read_line(&mut temp_line).unwrap();
		let mut current_recv = 0;
		let mut current_send = 0;
		loop {
			let mut line = String::new();
			if let Ok(_) = reader.read_line(&mut line) {
				if line.len() == 0 {
					break;
				}
				let current_measurement: Vec<u64> = line.split_whitespace().skip(1).map(|s| s.parse::<u64>().unwrap()).collect();
				current_recv += current_measurement[0];
				current_send += current_measurement[8];
			} else {
				break;
			}
		}
		let elapsed_time_in_s = self.last_measurement_time.to(now).num_milliseconds() as f32 / 1000.0;
		let result = if self.last_measurement_recv == 0 {
			None
		} else {
			let recv_rate = (current_recv - self.last_measurement_recv) as f32/elapsed_time_in_s;
			let send_rate = (current_send - self.last_measurement_send) as f32/elapsed_time_in_s;
			let usage = NetworkUsage {recv: recv_rate, send: send_rate};
			Some(usage)
		};
		self.last_measurement_send = current_send;
		self.last_measurement_recv = current_recv;
		self.last_measurement_time = now;
		result
	}
}
