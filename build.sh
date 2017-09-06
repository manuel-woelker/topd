#!/bin/bash

set -e

(cd ui && yarn install && yarn run build)
cargo build --verbose
cargo test --verbose
