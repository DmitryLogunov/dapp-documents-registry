const {ethers} = require("hardhat");
const {validateEnvironmentConfiguration} = require("./helpers/validate.helper");
const {initializeEnvironmentConfiguration} = require("./helpers/init.helper");

async function main() {
  validateEnvironmentConfiguration('one-account');

  const {contractName, contractAddress, theFirstAddress: tokenOwnerAddress}
    = initializeEnvironmentConfiguration('one-account');

  const contractToken = await ethers.getContractFactory(contractName);
  const contractInstance = await contractToken.attach(contractAddress);

  console.log(` --> Tokens owner: ${tokenOwnerAddress}`);

  let accountTokens = await contractInstance.getAccountTokens(tokenOwnerAddress);
  console.log(` --> Account tokens (before): ${JSON.stringify(accountTokens)}`);

  const accountTokensNumber = accountTokens.length;
  const nextTokenIndex = accountTokensNumber + 1;
  const nextTokenURI = `http://some.url/path/to/metadata.${tokenOwnerAddress}.${nextTokenIndex}.json`;

  const tokenId = await contractInstance.createToken(tokenOwnerAddress, nextTokenURI);
  console.log(` --> Token ID: ${JSON.stringify(tokenId)}`);

  accountTokens = await contractInstance.getAccountTokens(tokenOwnerAddress);
  console.log(` --> Account tokens (after): ${JSON.stringify(accountTokens)}`);

  const tokensNumber = await contractInstance.getTokensNumber();
  console.log(` --> All contract tokens number: ${tokensNumber}`);

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
