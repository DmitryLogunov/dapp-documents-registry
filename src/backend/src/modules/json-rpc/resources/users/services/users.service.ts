import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {UsersEntity} from "@/libs/database/entities";
import {randomString} from "@/libs/common/helpers/random.helpers";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    protected usersRepository: Repository<UsersEntity>) {
  }

  /**
   * Returns user: tries to find it in DB or create it in case it does not exist
   *
   * @param accountAddress
   */
  public async getOrCreate(accountAddress: string): Promise<UsersEntity> {
    if (!accountAddress) {
      throw new NotFoundException();
    }

    const user =
      await this.usersRepository.findOne({accountAddress}) ||
      new UsersEntity();

    user.accountAddress = accountAddress;
    user.nonce = randomString(10);

    await this.usersRepository.save(user);

    return user;
  }

  /**
   * Checks signature and returns JWT auth token in case of success
   *
   * @param accountAddress
   * @param signature
   */
  public async authenticate(accountAddress: string, signature: string): Promise<{accessToken: string|null}> {
    return;
  }
}
