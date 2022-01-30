const {ethers} = require("hardhat");
const {resolve} = require("path");
const fs = require('fs');
const {validateEnvironmentConfiguration} = require("./helpers/validate.helper");
const {initializeEnvironmentConfiguration} = require("./helpers/init.helper");

async function main() {
  validateEnvironmentConfiguration('one-account');

  const {contractName, contractAddress, adminAddress, theFirstAddress: tokenOwnerAddress}
    = initializeEnvironmentConfiguration('one-account');

  // const contractToken = await ethers.getContractFactory(contractName);
  // const contractInstance = await contractToken.attach(contractAddress);

  const abiPath = resolve(process.cwd(), `./artifacts/contracts/${contractName}.sol/${contractName}.json`);
  const compiledContract = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
  const {abi} = compiledContract;

  const ethereumRpcProviderURL = process.env.ETHEREUM_RPC_PROVIDER_URL;
  const provider = new ethers.providers.JsonRpcProvider(ethereumRpcProviderURL);
  const signer = provider.getSigner(adminAddress)
  const contractInstance = new ethers.Contract(contractAddress, abi, signer);

  let tokensNumber = await contractInstance.getTokensNumber();
  console.log(` --> All contract tokens number: ${tokensNumber}`);

  let adminBalance = await provider.getBalance(adminAddress);
  let tokenOwnerBalance = await provider.getBalance(tokenOwnerAddress);
  console.log(` --> Tokens owner: ${tokenOwnerAddress}, token owner balance: ${ethers.utils.formatEther(tokenOwnerBalance)}`);
  console.log(` --> Admin account address: ${adminAddress}, admin address balance: ${ethers.utils.formatEther(adminBalance)}`);

  let accountTokens = await contractInstance.getAccountTokens(tokenOwnerAddress);
  console.log(` --> Tokens owner tokens (before): ${JSON.stringify(accountTokens)}`);

  const accountTokensNumber = accountTokens.length;
  const nextTokenIndex = accountTokensNumber + 1;
  const nextTokenURI = `http://some.url/path/to/metadata.${tokenOwnerAddress}.${nextTokenIndex}.json`;

  const tokenId = await contractInstance.createToken(tokenOwnerAddress, nextTokenURI);
  console.log(` --> Token ID: ${JSON.stringify(tokenId)}`);

  accountTokens = await contractInstance.getAccountTokens(tokenOwnerAddress);
  console.log(` --> Account tokens (after): ${JSON.stringify(accountTokens)}`);

  tokensNumber = await contractInstance.getTokensNumber();
  console.log(` --> All contract tokens number: ${tokensNumber}`);

  adminBalance = await provider.getBalance(adminAddress);
  tokenOwnerBalance = await provider.getBalance(tokenOwnerAddress);
  console.log(` --> Tokens owner: ${tokenOwnerAddress}, token owner balance: ${ethers.utils.formatEther(tokenOwnerBalance)}`);
  console.log(` --> Admin account address: ${adminAddress}, admin address balance: ${ethers.utils.formatEther(adminBalance)}`);


  console.log(` --> Account tokens info:`);
  let tokenIndex = 0;
  for await (const tokenId of accountTokens) {
    const tokenMetadataURI = await contractInstance.tokenURI(tokenId);

    console.log(`      - index: ${tokenIndex}`);
    console.log(`          tokenId: ${tokenId}`);
    console.log(`          tokenMetadataURI: ${tokenMetadataURI}`)

    tokenIndex++
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
