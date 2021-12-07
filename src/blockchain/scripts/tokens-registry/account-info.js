const {ethers} = require("hardhat");
const {validateEnvironmentConfiguration} = require("./helpers/validate.helper");
const {initializeEnvironmentConfiguration} = require("./helpers/init.helper");

async function main() {
  validateEnvironmentConfiguration('one-account')

  const {contractName, contractAddress, theFirstAddress: accountAddress}
    = initializeEnvironmentConfiguration('one-account');

  const contractToken = await ethers.getContractFactory(contractName);
  const contractInstance = await contractToken.attach(contractAddress);

  console.log(` --> Account address: ${accountAddress}`);

  let accountTokens = await contractInstance.getAccountTokens(accountAddress);
  console.log(` --> Account tokens: ${JSON.stringify(accountTokens)}`);

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
