import {RpcHandler, RpcMethodHandler, RpcPayload} from '@jashkasoft/nestjs-json-rpc';

import {GetOrCreateUserPayloadDto} from "../dto/payloads.dto";
import {GetOrCreateUserResponseDto} from "../dto/responses.dto";
import {UsersService} from "../services/users.service";


@RpcHandler({method: 'users'})
export class UsersHandler {
  constructor(
    private readonly usersService: UsersService) {
  }

  @RpcMethodHandler('getOrCreate')
  async getOrCreate(@RpcPayload() payload: GetOrCreateUserPayloadDto): Promise<GetOrCreateUserResponseDto> {
    const {accountAddress} = payload;
    return await this.usersService.getOrCreate(accountAddress);
  }
}
