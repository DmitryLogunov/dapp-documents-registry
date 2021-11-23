import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import {HmacSHA256} from 'crypto-js';
import {InjectRepository} from "@nestjs/typeorm";

//import {PasswordsEntity, UsersEntity} from "@/libs/database/entities";
import {UsersEntity} from "@/libs/database/entities";
import {Repository} from "typeorm";
import {UsersStatusTypes} from "@/libs/database/types/users-status.types";
import {TokenType} from "../types";


@Injectable()
export class AuthenticationService {
  private readonly cryptoJSCheckDatetimeFrom: Date;
  private readonly hmacSHA256SecretKey: string;

  constructor(
    private jwtService: JwtService,
    @InjectRepository(UsersEntity)
    private usersEntityRepository: Repository<UsersEntity>,
  ) {
    this.cryptoJSCheckDatetimeFrom = new Date(process.env.CRYPTO_JS_CHECK_DATETIME_FROM);
    this.hmacSHA256SecretKey = process.env.HMAC_SHA256_SECRET_KEY;
  }

  public async login(userData: { username: string, password: string }): Promise<TokenType> {
    const {username, password} = userData;

    const user = await this.findAndValidateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    user.lastActivity = new Date();
    await this.usersEntityRepository.save(user);

    return this.tokenGenerator(user);
  }

  public async findAndValidateUser(username: string, pass: string): Promise<UsersEntity> {
    const user = await this.usersEntityRepository.findOne(
      {email: username},
      {relations: ["company"]}
    );

    if (!user || user.status !== UsersStatusTypes.Active) return;

    const {passwordHash, updatedAt: passwordUpdatedAt} = {passwordHash: '', updatedAt: new Date() };
 //   await this.passwordsEntityRepository.findOne({user}) || {};

    if (!passwordHash) return;

    if (passwordUpdatedAt < this.cryptoJSCheckDatetimeFrom &&
      !await bcrypt.compare(pass, passwordHash)) return;

    if (passwordUpdatedAt >= this.cryptoJSCheckDatetimeFrom &&
      HmacSHA256(pass, this.hmacSHA256SecretKey).toString() !== passwordHash) return;

    return user;
  }

  private async tokenGenerator(user: UsersEntity): Promise<TokenType> {
    const payload = {
      sub: user.id,
      email: user.email,
      lastActivity: user.lastActivity
    };

    return {
      accessToken: this.jwtService.sign(payload),
      userId: user.id,
      isActive: user.status === UsersStatusTypes.Active
    };
  }
}
