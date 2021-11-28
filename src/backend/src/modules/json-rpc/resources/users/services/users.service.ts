import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {UsersEntity} from "@/libs/database/entities";
import {randomString} from "@/libs/common/helpers/random.helpers";
import {UsersStatusTypes} from "@/libs/database/types/users-status.types";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>) {
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
    user.status = UsersStatusTypes.Active;

    await this.usersRepository.save(user);

    console.log(user);

    return user;
  }
}
