import {RpcHandler, RpcMethodHandler, RpcPayload} from '@jashkasoft/nestjs-json-rpc';

import {
  GetAccountTokensPayloadDto,
  CreateTokenPayloadDto,
  TransferTokensPayloadDto
} from "@/libs/contracts/tokens-registry-contract-client/dto/payloads.dto";
import {TokenInfoResponseDto, TokenCreateResponseDto} from "@/libs/contracts/tokens-registry-contract-client/dto/responses.dto";
import {TokensService} from "../services/tokens.service";

@RpcHandler({method: 'tokens'})
export class TokensHandler {
  constructor(public tokensService: TokensService) {}

  @RpcMethodHandler('getTokensNumber')
  async getTokensNumber(): Promise<number> {
     return await this.tokensService.getTokensNumber();
  }

  @RpcMethodHandler('getAccountTokens')
  async getAccountTokens(@RpcPayload() payload: GetAccountTokensPayloadDto): Promise<Array<TokenInfoResponseDto>> {
    return await this.tokensService.getAccountTokens(payload);
  }

  @RpcMethodHandler('createToken')
  async createToken(@RpcPayload() payload: CreateTokenPayloadDto): Promise<TokenCreateResponseDto> {
    return await this.tokensService.createToken(payload);
  }

  @RpcMethodHandler('transferToken')
  async transferToken(@RpcPayload() payload: TransferTokensPayloadDto): Promise<void> {
    return await this.tokensService.transferToken(payload);
  }
}
