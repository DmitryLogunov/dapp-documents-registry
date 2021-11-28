import {RpcHandler, RpcMethodHandler, RpcPayload} from '@jashkasoft/nestjs-json-rpc';

import {AuthenticationPayloadDto} from "../dto/authentication.dto";
import {AuthenticationService} from "../services/authentication.service";
import {TokenType} from "../types";


@RpcHandler({method: 'authentication'})
export class AuthenticationHandler {
  constructor(
    private readonly authenticationService: AuthenticationService) {
  }

  @RpcMethodHandler('login')
  async login(@RpcPayload() payload: AuthenticationPayloadDto): Promise<TokenType> {
    return await this.authenticationService.login(payload);
  }
}
