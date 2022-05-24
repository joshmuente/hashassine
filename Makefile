.PHONY: near/login-testnet
near/login-testnet:
	near generate-key --seedPhrase '${TESTNET_PRIV_KEY}'

.PHONY: contract/build
contract/build:
	cd contract && cargo build --target wasm32-unknown-unknown --release

.PHONY: contract/deploy-testnet
contract/deploy-testnet:
	cd contract && near deploy --accountId hashassine.testnet --wasmFile target/wasm32-unknown-unknown/release/hashassine.wasm

.PHONY: frontend/build
frontend/build:
	cd hashassine-frontend && npm run ng build --prod