#![allow(dead_code)]
#[macro_use]
extern crate nickel;

use nickel::{Nickel, HttpRouter, StaticFilesHandler};

fn main() {
    let mut server = Nickel::new();
    server.utilize(StaticFilesHandler::new("target/doc/"));
//    server.get("**", middleware!("Hello World"));
    server.listen("127.0.0.1:3000");
    println!("Listening on http://localhost:3000/");
}
