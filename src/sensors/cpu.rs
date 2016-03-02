
use time::{PreciseTime};
use std::io;
use std::io::prelude::*;
use std::fs::File;
use std::ops::Index;

pub struct CpuSensor {
	last_measurement_time: PreciseTime ,
	last_measurement: [u64; 10]
}

#[derive(Debug)]
pub struct CpuUsage {
	pub usage: [f32; 10]
}

impl Index<usize> for CpuUsage {
    type Output = f32;

    fn index<'a>(&'a self, _index: usize) -> &'a f32 {
        &self.usage[_index]
    }
}

impl CpuSensor {
	pub fn new() -> CpuSensor {
		CpuSensor { last_measurement_time: PreciseTime::now(), last_measurement: [0; 10]}
	}

	pub fn measure(&mut self) -> Option<CpuUsage> {
		let file = File::open("/proc/stat").unwrap();
		let mut reader = io::BufReader::new(file);
		let mut line = String::new();
		reader.read_line(&mut line).unwrap();
		let current_measurement: Vec<u64> = line.split_whitespace().skip(1).map(|s| s.parse::<u64>().unwrap()).collect();
		let mut delta = [0u64; 10];
		let mut sum = 0f32;
		for i in 0..10 {
			delta[i] = current_measurement[i] - self.last_measurement[i];
			self.last_measurement[i] = current_measurement[i];
			// TODO: handle overflow/underflow?
			sum += delta[i] as f32;
		}
		// TODO: protect divzero
		let mut usage = [0f32; 10];
		for i in 0..10 {
			usage[i] = delta[i] as f32/sum;
		}
		Some(CpuUsage {usage: usage})
	}
}
