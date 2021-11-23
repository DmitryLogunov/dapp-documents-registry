import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UsersEntity} from "@/libs/database/entities";
import {Repository} from "typeorm";

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
    return;
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
