const {ethers} = require("hardhat");

require('dotenv').config({path: `${process.cwd()}/.env`});

const contractName = process.env.CONTRACT_NAME;
const adminAccount = process.env.ADMIN_ACCOUNT;

async function main() {
  const contractToken = await ethers.getContractFactory(contractName);
  const contract = await contractToken.deploy(adminAccount, "NFT registry contract", "NFT_REGISTRY");

  await contract.deployed();

  console.log("Contract deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
