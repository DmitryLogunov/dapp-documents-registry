const {ethers} = require("hardhat");
const {resolve} = require("path");
const fs = require('fs');
const {validateEnvironmentConfiguration} = require("./helpers/validate.helper");
const {initializeEnvironmentConfiguration} = require("./helpers/init.helper");

async function main() {
  validateEnvironmentConfiguration('transfer');

  const {contractName, contractAddress, theFirstAddress: fromAddress,
         theSecondAddress: toAddress, transferTokenIndex}
         = initializeEnvironmentConfiguration('transfer');

  const abiPath = resolve(process.cwd(), `./artifacts/contracts/${contractName}.sol/${contractName}.json`);
  const compiledContract = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
  const {abi} = compiledContract;

  const ethereumRpcProviderURL = process.env.ETHEREUM_RPC_PROVIDER_URL;
  const provider = new ethers.providers.JsonRpcProvider(ethereumRpcProviderURL);
  const signer = provider.getSigner(fromAddress)
  const contractInstance = new ethers.Contract(contractAddress, abi, signer);

  console.log(` --> 'From' account address: ${fromAddress}`);
  console.log(` --> 'To' account address: ${toAddress}`);

  let fromAccountTokens = await contractInstance.getAccountTokens(fromAddress);
  console.log(` --> 'From' account tokens (before): ${JSON.stringify(fromAccountTokens)}`);

  let toAccountTokens = await contractInstance.getAccountTokens(toAddress);
  console.log(` --> 'To' account tokens (before): ${JSON.stringify(toAccountTokens)}`);

  console.log(` --> Transfer token index: ${transferTokenIndex}`);
  const transferTokenId = await contractInstance.tokenOfOwnerByIndex(fromAddress, transferTokenIndex);
  console.log(` --> Transfer token: ${transferTokenIndex}: ${JSON.stringify(transferTokenId)}`);

  await contractInstance.transfer(transferTokenId, toAddress);

  fromAccountTokens = await contractInstance.getAccountTokens(fromAddress);
  console.log(` --> 'From' account tokens (after): ${JSON.stringify(fromAccountTokens)}`);

  toAccountTokens = await contractInstance.getAccountTokens(toAddress);
  console.log(` --> 'To' account tokens (after): ${JSON.stringify(toAccountTokens)}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
