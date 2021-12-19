import {
  CreateTokenPayloadDto,
  GetAccountTokensPayloadDto,
  TransferTokensPayloadDto
} from "@/libs/contracts/tokens-registry-contract-client/dto/payloads.dto";

export type TokensRegistryContractConfigurationType = {
  ethereumRpcUrl: string,
  contractName: string,
  contractAbiPath: string,
  contractAddress: string,
  adminAccountAddress: string
}

import {TokenInfoResponseDto, TokenCreateResponseDto, TokenIdResponseDto} from "@/libs/contracts/tokens-registry-contract-client/dto/responses.dto";

export const TokensRegistryContractClientProvider = 'TOKENS_REGISTRY_CONTRACT_CLIENT_PROVIDER';

export interface ITokensRegistryContractClient {
  getTokensNumber: () => Promise<number>;
  getAccountTokens: (payload: GetAccountTokensPayloadDto) => Promise<Array<TokenInfoResponseDto>>;
  createToken: (payload: CreateTokenPayloadDto) => Promise<TokenCreateResponseDto>;
  transferToken: (payload: TransferTokensPayloadDto) => Promise<void>;
}

export interface ITokensRegistryContract {
  getTokensNumber: () => Promise<number>;
  getAccountTokens: (address: string) => Promise<Array<TokenIdResponseDto>>;
  createToken: (owner: string, url: string) => Promise<TokenCreateResponseDto>;
  tokenOfOwnerByIndex: (owner: string, tokenIndex: number) => Promise<unknown>;
  tokenURI:(tokenId: any) => Promise<string>;
  transfer: (tokenId: unknown, address: string) => Promise<void>;
}
