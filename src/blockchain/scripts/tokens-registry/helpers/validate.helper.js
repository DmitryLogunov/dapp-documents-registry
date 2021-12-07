function validateEnvironmentConfiguration(type) {
  switch (type) {
    case 'one-account':
      if (process.argv[2] !== '1' && process.argv[2] != '2') {
        console.log('\nError: incorrect command format. The first parameter (theNumberOfOwner) id required\n');
        console.log('Example: node ./create-token.js 1');
        console.log(`Here '1' - the number of account address in configuration file .env.\n`);

        process.exit(1);
      }
      return;
    case 'transfer':
      if ((process.argv[2] !== '1' && process.argv[2] != '2') ||
        (process.argv[3] !== '1' && process.argv[3] != '2') ||
        typeof process.argv[3] === 'undefined' ||
        Number.isNaN(parseInt(process.argv[3], 10))) {
        console.log('\nError: incorrect command format. Three parameters are required\n');
        console.log(`Format: node ./transfer-token.js <fromAddress> <toAddress> <tokenIndexToTransfer>\n`);
        console.log('Example: node ./transfer-token.js 1 2 5');
        console.log(`Here '1' - the number of 'from' account address in configuration file .env.`);
        console.log(`     '2' - the number of 'to' account address in configuration file .env.\n`);
        console.log(`     '5' - the index of token in 'from' account tokens list\n`);

        process.exit(1);
      }
  }
}

module.exports = { validateEnvironmentConfiguration }