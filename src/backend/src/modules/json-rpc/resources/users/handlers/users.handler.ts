import {RpcHandler, RpcMethodHandler, RpcPayload} from '@jashkasoft/nestjs-json-rpc';

import {GetOrCreateUserPayloadDto, AuthenticateUserPayloadDto} from "../dto/payloads.dto";
import {GetOrCreateUserResponseDto, AuthenticateUserResponseDto} from "../dto/responses.dto";
import {UsersService} from "../services/users.service";


@RpcHandler({method: 'users'})
export class UsersHandler {
  constructor(
    private readonly usersService: UsersService) {
  }

  @RpcMethodHandler('getOrCreate')
  async getCategories(@RpcPayload() payload: GetOrCreateUserPayloadDto): Promise<GetOrCreateUserResponseDto> {
    const {accountAddress} = payload;
    return await this.usersService.getOrCreate(accountAddress);
  }

  @RpcMethodHandler('authenticate')
  async updateCategoryType(@RpcPayload() payload: AuthenticateUserPayloadDto):
    Promise<AuthenticateUserResponseDto> {
    const {accountAddress, signature} = payload;
    return await this.usersService.authenticate(accountAddress, signature);
  }
}
