
use std::io;
use std::io::prelude::*;
use std::fs::File;
use std::collections::HashMap;

pub struct MemorySensor;

#[derive(Debug)]
pub struct MemoryUsage {
	pub used: f32,
	pub buffers: f32,
	pub cache: f32,
	pub swap: f32,
}

impl MemorySensor {
	pub fn new() -> MemorySensor {
		MemorySensor
	}

	pub fn measure(& self) -> Option<MemoryUsage> {
		let mut value_map = HashMap::<String, String>::new();
		let f = File::open("/proc/meminfo").unwrap();
		let f = io::BufReader::new(f);
		for line in f.lines() {
		        let l = line.unwrap();
				let mut items = l.split_whitespace();
				let key = items.next().unwrap();
				let value = items.next().unwrap();
				value_map.insert(key.to_owned(), value.to_owned());
		}
		/*
		f.read_line(&mut line);
		let current_measurement: Vec<u64> = line.split_whitespace();
		let value_map = HashM*/
		let total:f32 = value_map.get("MemTotal:").unwrap().parse().unwrap();
		let free:f32 = value_map.get("MemFree:").unwrap().parse().unwrap();
		let buffers:f32 = value_map.get("Buffers:").unwrap().parse().unwrap();
		let cached:f32 = value_map.get("Cached:").unwrap().parse().unwrap();
		let used:f32 = total - free - buffers - cached;

		let swap_total:f32 = value_map.get("SwapTotal:").unwrap().parse().unwrap();
		let swap_free:f32 = value_map.get("SwapFree:").unwrap().parse().unwrap();
		return Some(MemoryUsage{used: used/total, buffers: buffers/total, cache: cached/total, swap: 1.0f32-swap_free/swap_total});
	}
}
