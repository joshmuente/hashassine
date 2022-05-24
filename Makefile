near/login-testnet:
	near generate-key --seedPhrase '${TESTNET_PRIV_KEY}'

contract/build:
	cd contract && cargo build --target wasm32-unknown-unknown --release

contract/deploy-testnet:
	cd contract && near deploy --accountId hashassine.testnet --wasmFile target/wasm32-unknown-unknown/release/hashassine.wasm

frontend/build:
	cd hashassine-frontend && npm run ng build --prod