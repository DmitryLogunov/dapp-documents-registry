import { registerAs } from '@nestjs/config';

import { TokensRegistryContractConfigurationType } from '../types';

export default registerAs('tokens-registry-contract-configuration', (): TokensRegistryContractConfigurationType => ({
  ethereumRpcUrl: process.env.ETHEREUM_RPC_PROVIDER_URL,
  contractName: process.env.CONTRACT_NAME,
  contractAbiPath: process.env.CONTRACT_ABI_PATH,
  contractAddress: process.env.CONTRACT_ADDRESS,
  adminAccountAddress: process.env.ADMIN_ACCOUNT
}));
