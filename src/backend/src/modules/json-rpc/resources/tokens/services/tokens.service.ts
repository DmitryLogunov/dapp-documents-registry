import {ConfigService} from '@nestjs/config';
import {Repository} from "typeorm";

import {
  GetAccountTokensPayloadDto,
  CreateTokenPayloadDto,
  TransferTokensPayloadDto
} from "@/libs/contracts/tokens-registry-contract-client/dto/payloads.dto";
import {TokenInfoResponseDto, TokenCreateResponseDto} from "@/libs/contracts/tokens-registry-contract-client/dto/responses.dto";
import {Inject, Injectable} from "@nestjs/common";
import {
  ITokensRegistryContractClient,
  TokensRegistryContractClientProvider, TokensRegistryContractConfigurationType
} from "@/libs/contracts/tokens-registry-contract-client/types";
import {InjectRepository} from "@nestjs/typeorm";
import {TokensEntity} from "@/libs/database/entities/tokens.entity";
import {get} from "@/libs/common/helpers/object.helpers";

@Injectable()
export class TokensService {
  private contractConfig: TokensRegistryContractConfigurationType;

  constructor(
    @Inject(TokensRegistryContractClientProvider)
    public tokensRegistryContractClient: ITokensRegistryContractClient,
    @InjectRepository(TokensEntity)
    private tokensRepository: Repository<TokensEntity>,
    private config: ConfigService
    ) {
    this.contractConfig =
      config.get<TokensRegistryContractConfigurationType>('tokens-registry-contract-configuration');
  }

  async getTokensNumber(): Promise<number> {
     return await this.tokensRegistryContractClient.getTokensNumber();
  }

  async getAccountTokens(payload: GetAccountTokensPayloadDto): Promise<Array<TokenInfoResponseDto>> {
    const accountTokens =  await this.tokensRegistryContractClient.getAccountTokens(payload);

    return await Promise.all(
      accountTokens.map(async (token, index) => {
        const {contractAddress, ownerAddress, tokenId, detail} =
          (await this.tokensRepository.find({
            contractAddress: this.contractConfig.contractAddress,
            tokenId: parseInt(get(token.tokenId, '_hex'), 16)
          })).shift() || {};
        const tokenInfo = {contractAddress, ownerAddress, tokenId, detail};

        return {
          accountTokenIndex: index,
          tokenId: token.tokenId,
          metadataURI: token.metadataURI,
          tokenInfo
        }
      })
    );

  }

  async createToken(payload: CreateTokenPayloadDto): Promise<TokenCreateResponseDto> {
    const {ownerAddress} = payload;

    const newTokenInfo = await this.tokensRegistryContractClient.createToken(payload);

    const tokenEntityInstance = new TokensEntity();
    tokenEntityInstance.contractAddress = this.contractConfig.contractAddress;
    tokenEntityInstance.tokenId = parseInt(get(newTokenInfo, 'nonce'), 10);
    tokenEntityInstance.ownerAddress = ownerAddress;
    tokenEntityInstance.detail = newTokenInfo;
    await this.tokensRepository.save(tokenEntityInstance);

    return newTokenInfo;
  }

  async transferToken(payload: TransferTokensPayloadDto): Promise<void> {
    const {fromAccountAddress, toAccountAddress, tokenIndex} = payload;

    const accountTokens =
      await this.tokensRegistryContractClient.getAccountTokens({accountAddress: fromAccountAddress});
    const transferredToken = accountTokens[tokenIndex];
    const transferredTokenId = parseInt(get(transferredToken.tokenId, '_hex'), 16);

    await this.tokensRegistryContractClient.transferToken(payload);

    const dbTransferredToken =
      (await this.tokensRepository.find({
        contractAddress: this.contractConfig.contractAddress,
        tokenId: transferredTokenId
      })).shift();

    if (dbTransferredToken) {
      dbTransferredToken.ownerAddress = toAccountAddress;
      await this.tokensRepository.save(dbTransferredToken);
    }
  }
}
