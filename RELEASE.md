```
cargo release

git checkout <tag>

cargo build --release --target=x86_64-unknown-linux-musl
strip target/x86_64-unknown-linux-musl/release/topd
```
