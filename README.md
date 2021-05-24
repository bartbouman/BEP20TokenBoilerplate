# BEP20TokenBoilerplate
Boilerplate project to start a new BEP20 token

## DEV

### After checkout

To get this project running, after checkout run:

- `npm install`

#### Run the tests:

- `npx hardhat test`
  
### Running the contract

#### What you'll need:

- [How to use MetaMask](https://academy.binance.com/en/articles/how-to-use-metamask)
- [Connecting MetaMask to Binance Smart Chain (BSC)](https://academy.binance.com/nl/articles/connecting-metamask-to-binance-smart-chain)
- [Fund your wallet address with (testnet) BNB](https://testnet.binance.org/faucet-smart)

#### To run the contract locally:

- `npx hardhat node`
- `npx hardhat run --network localhost scripts/deploy_local.js`
  


*NOTE: Before proceeding, make sure you have your recovery for metamask somewhere!!!

Then open Chrome with MetaMask installed.

- Connect MetaMask to `Localhost 8545`
- Recover a wallet with the mnemonic words: `[your mnemonic phrase]`
- Add a custom token with the token address on your clipboard

Done! Have fun sending TOKEN around :-) 