const {resolve} = require("path");
const fs = require('fs');
const Web3 = require('web3');

const ethereumRpcProviderURL = process.env.ETHEREUM_RPC_PROVIDER_URL;
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumRpcProviderURL));

const contractName = process.env.CONTRACT_NAME;
const adminAccount = process.env.ADMIN_ACCOUNT;

(async () => {
  console.log(` [info] Start deploying: ${contractName}.sol `)
  const coinBase = await web3.eth.getCoinbase();

  const balance = await web3.eth.getBalance(adminAccount);
  console.log(` [info] Admin address: ${adminAccount}, balance: ${balance}`);

  const abiPath = resolve(process.cwd(), `./artifacts/contracts/${contractName}.sol/${contractName}.json`);
  const compiledContract = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
  const {abi, bytecode} = compiledContract;

  const gasEstimation = await web3.eth.estimateGas({ to: adminAccount, data: bytecode });
  console.log(` [info] Gas estimation: ${gasEstimation}`);

  const contractObject =
    new web3.eth.Contract(abi, coinBase, {
      from: adminAccount, gas: gasEstimation, data: bytecode });

  contractObject
    .deploy({data: bytecode, arguments: ['Hello solidity']})
    .send({from: adminAccount, gas: 10000000, gasPrice: 1000000000})
    .on('error', (error) => {
      console.log('[event] [onError] Error: ' + error)
    })
    .on('transactionHash', (transactionHash) => {
      console.log(' [event] [onTransactionHash] transactionHash: ' + transactionHash) })
    .on('receipt', (receipt) => {
      console.log(' [event] [onReceipt] contractAddress: ' + receipt.contractAddress)
    })
    .on('confirmation', (confirmationNumber, receipt) => {
        console.log(' [event] [onConfirmation] confirmationNumber: ' + confirmationNumber)
        process.exit(0);
      })
    .then((newContractInstance) => {
        console.log(' [info] Contract Deployed');
        console.log(' [info] ProviderAddress: ' + adminAccount);
        console.log(' [info] New Contract address: ' + newContractInstance.options.address);
    })
    .catch((error) => {
      console.error(` [error] Error: ${error}`);
    });

})();
