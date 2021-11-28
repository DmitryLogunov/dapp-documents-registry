import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";

import {UsersEntity} from "@/libs/database/entities";
import {LoggingModule} from "@/libs/logging/logging.module";

import {UsersHandler} from "./handlers/users.handler";
import {UsersService} from "./services/users.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    LoggingModule.forRoot({serviceName: 'Users RPC module'})
  ],
  providers: [UsersHandler, UsersService],
  exports: [UsersService]
})
export class UsersModule {
}
