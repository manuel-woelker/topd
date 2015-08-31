#![allow(dead_code)]
#[macro_use]
extern crate nickel;
extern crate procinfo;

extern crate serde;
extern crate serde_json;

use std::collections::HashMap;

use nickel::{Nickel, HttpRouter, StaticFilesHandler, MediaType};

fn main() {
    let mut server = Nickel::new();
    let mut router = Nickel::router();

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
//    server.get("**", middleware!("Hello World"));
    server.listen("127.0.0.1:3000");
    println!("Listening on http://localhost:3000/");
}
