const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokensRegistry", function () {
  it("Should create a new account NFT token", async function () {
    const accounts = await ethers.getSigners();
    const adminAccount = accounts[0].address;
    const accountAddress = accounts[1].address;

    const TokensRegistry = await ethers.getContractFactory("TokensRegistry");
    const tokensRegistry = await TokensRegistry.deploy(adminAccount, "NFT registry contract", "NFT_REGISTRY");
    await tokensRegistry.deployed();

    const contractAddress = tokensRegistry.address;
    const contractInstance = await TokensRegistry.attach(contractAddress);
    console.log(contractAddress);

    const tokenURI = `http://some.url/path/to/metadata.${accountAddress}.json`;

    const tokenData = await contractInstance.createToken(accountAddress, tokenURI);
    expect(typeof tokenData).to.eq('object');

    const accountTokens = await contractInstance.getAccountTokens(accountAddress);
    expect(accountTokens.length).to.eq(1);

    const tokenId = accountTokens[0];
    const tokenURIFromBlockchain = await contractInstance.tokenURI(tokenId);
    expect(tokenURIFromBlockchain).to.eq(tokenURI);
  });
});
