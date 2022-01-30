require("@nomiclabs/hardhat-waffle");

require('dotenv').config({path: `${process.cwd()}/.env`});

const blockchainRPCProviderURL = process.env.ETHEREUM_RPC_PROVIDER_URL;
const adminAccountPrivateKey = process.env.BSC_ADMIN_ACCOUNT_PRIVATE_KEY;
const networkID = parseInt(process.env.NETWORK_ID, 10);
const gasPrice = parseInt(process.env.GAS_PRICE, 10);

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "appNet",
  networks: {
    appNet: {
      url: blockchainRPCProviderURL,
      chainId: networkID,
      gasPrice: gasPrice,
      accounts: adminAccountPrivateKey && [`0x${adminAccountPrivateKey}`]
    }
  }
};