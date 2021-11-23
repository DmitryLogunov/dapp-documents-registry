import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";

import {UsersEntity} from "@/libs/database/entities";
import {UsersController} from "@/modules/json-api/resources/users/controllers/users.controller";

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [UsersController],
})
export class UsersModule {}