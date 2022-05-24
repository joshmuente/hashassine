.PHONY: contract/build
contract/build:
	cd contract && cargo build --target wasm32-unknown-unknown --release

.PHONY: contract/deploy-testnet
contract/deploy-testnet:
	-near delete app.hashassine.testnet hashassine.testnet --masterAccount hashassine.testnet
	near create-account --masterAccount hashassine.testnet app.hashassine.testnet
	cd contract && near deploy --accountId app.hashassine.testnet --masterAccount hashassine.testnet --initFunction "new" --initArgs "{}" --wasmFile target/wasm32-unknown-unknown/release/hashassine.wasm

.PHONY: frontend/build
frontend/build:
	cd hashassine-frontend && npm run ng build --prod