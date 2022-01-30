require('dotenv').config({path: `${process.cwd()}/.env`});

function initializeEnvironmentConfiguration(type) {
  const contractName = process.env.CONTRACT_NAME;
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const adminAddress = process.env.ADMIN_ACCOUNT;
  const theFirstAddress =
    process.argv[2] === '1' ?
      process.env.ACCOUNT_ADDRESS_1 :
      process.env.ACCOUNT_ADDRESS_2;

  if (type === 'one-account') {
    return {contractName, contractAddress, adminAddress, theFirstAddress};
  }

  const theSecondAddress =
    process.argv[3] === '1' ?
      process.env.ACCOUNT_ADDRESS_1 :
      process.env.ACCOUNT_ADDRESS_2;
  const transferTokenIndex = parseInt(process.argv[4], 10);

  return {contractName, contractAddress, adminAddress, theFirstAddress, theSecondAddress, transferTokenIndex};
}

module.exports = { initializeEnvironmentConfiguration }