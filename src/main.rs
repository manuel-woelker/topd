#![allow(dead_code)]
extern crate procinfo;

#[macro_use]
extern crate serde_derive;
extern crate serde;
#[macro_use]
extern crate serde_json;

extern crate num_cpus;

extern crate libc;
extern crate ifaces;
extern crate iron;
extern crate mount;

#[macro_use]
extern crate mime;
extern crate time;
extern crate sys_info;
extern crate toml;



use std::io::{Read};
use std::fs::File;

pub mod sensors;

pub mod server;
pub mod util;

const VERSION: Option<&'static str> = option_env!("CARGO_PKG_VERSION");

struct MetricsEventStream;

fn default_port() -> u16 {
	3000
}
#[derive(Deserialize)]
pub struct Config {
	#[serde(default = "default_port")]
	port: u16,
}


fn main() {
	println!("topd v{}", VERSION.unwrap_or("?"));

    let config_file = File::open("topd.toml");
	let mut config = Config {
		port: default_port(),
	};
    if config_file.is_ok() {
        let mut config_content = String::new();
    	config_file.unwrap().read_to_string(&mut config_content).unwrap();
    	config = toml::from_str(&config_content).unwrap();
    }


	server::start(&config);

}
