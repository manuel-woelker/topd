#!/bin/bash

set -e

(cd ui && npm install && gulp build)
cargo build --verbose
cargo test --verbose
