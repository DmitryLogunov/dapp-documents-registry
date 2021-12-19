import {ConfigService} from '@nestjs/config';

const {ethers} = require("hardhat");
const {resolve} = require("path");
const fs = require('fs');

import {
  ITokensRegistryContract,
  ITokensRegistryContractClient,
  TokensRegistryContractClientProvider,
  TokensRegistryContractConfigurationType
} from '../types';
import {
  CreateTokenPayloadDto,
  GetAccountTokensPayloadDto, TransferTokensPayloadDto
} from "@/libs/contracts/tokens-registry-contract-client/dto/payloads.dto";
import {TokenInfoResponseDto, TokenCreateResponseDto} from "@/libs/contracts/tokens-registry-contract-client/dto/responses.dto";

export const tokensRegistryContractClientProvider = {
  provide: TokensRegistryContractClientProvider,
  useFactory: (config: ConfigService): ITokensRegistryContractClient => {
    const tokensRegistryContractConfig =
      config.get<TokensRegistryContractConfigurationType>('tokens-registry-contract-configuration');

    const abiPath = resolve(process.cwd(), tokensRegistryContractConfig.contractAbiPath);
    const compiledContract = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
    const {abi} = compiledContract;

    const provider = new ethers.providers.JsonRpcProvider(tokensRegistryContractConfig.ethereumRpcUrl);
    const getContractInstance = (signerAddress: string): ITokensRegistryContract => {
      const signer = provider.getSigner(signerAddress);
      return new ethers.Contract(tokensRegistryContractConfig.contractAddress, abi, signer);
    }

    return {
      getTokensNumber: async (): Promise<number> => {
        return await getContractInstance(tokensRegistryContractConfig.adminAccountAddress)
          .getTokensNumber();
      },

      getAccountTokens: async (payload: GetAccountTokensPayloadDto): Promise<Array<TokenInfoResponseDto>> => {
        const {accountAddress} = payload;
        const contractInstance = getContractInstance(tokensRegistryContractConfig.adminAccountAddress);
        const accountTokens = await contractInstance.getAccountTokens(accountAddress);

        return await Promise.all(
          accountTokens.map(async (tokenId) => ({
            tokenId,
            metadataURI: await contractInstance.tokenURI(tokenId)
          }))
        );
      },

      createToken: async (payload: CreateTokenPayloadDto): Promise<TokenCreateResponseDto> => {
        const {ownerAddress, metadataURI} = payload;
        return await getContractInstance(tokensRegistryContractConfig.adminAccountAddress)
          .createToken(ownerAddress, metadataURI);
      },

      transferToken: async (payload: TransferTokensPayloadDto): Promise<void> => {
        const {fromAccountAddress, toAccountAddress, tokenIndex} = payload;

        const transferredTokenId = await getContractInstance(fromAccountAddress)
          .tokenOfOwnerByIndex(fromAccountAddress, tokenIndex);
        await getContractInstance(fromAccountAddress).transfer(transferredTokenId, toAccountAddress);
      }
    };
  },
  inject: [ConfigService]
};
