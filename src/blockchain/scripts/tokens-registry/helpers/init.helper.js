require('dotenv').config({path: `${process.cwd()}/.env`});

function initializeEnvironmentConfiguration(type) {
  const contractName = process.env.CONTRACT_NAME;
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const theFirstAddress =
    process.argv[2] === '1' ?
      process.env.ACCOUNT_ADDRESS_1 :
      process.env.ACCOUNT_ADDRESS_2;

  if (type === 'one-account') {
    return {contractName, contractAddress, theFirstAddress};
  }

  const theSecondAddress =
    process.argv[3] === '1' ?
      process.env.ACCOUNT_ADDRESS_1 :
      process.env.ACCOUNT_ADDRESS_2;
  const transferTokenIndex = parseInt(process.argv[4], 10);

  return {contractName, contractAddress, theFirstAddress, theSecondAddress, transferTokenIndex};
}

module.exports = { initializeEnvironmentConfiguration }