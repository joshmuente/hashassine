.PHONY: contract/build
contract/build:
	cd contract && cargo build --target wasm32-unknown-unknown --release

.PHONY: contract/deploy-testnet
contract/deploy-testnet:
	cd contract && near deploy --accountId hashassine.testnet --masterAccount hashassine.testnet --wasmFile target/wasm32-unknown-unknown/release/hashassine.wasm --force
	-near call --accountId hashassine.testnet hashassine.testnet new

.PHONY: frontend/build
frontend/build:
	cd hashassine-frontend && npm run ng build --prod