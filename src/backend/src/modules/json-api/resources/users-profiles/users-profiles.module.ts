import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";

import {UsersProfilesEntity} from "@/libs/database/entities";
import {UsersProfilesController} from "@/modules/json-api/resources/users-profiles/controllers/users-profiles.controller";

@Module({
  imports: [TypeOrmModule.forFeature([UsersProfilesEntity])],
  controllers: [UsersProfilesController],
})
export class UsersProfilesModule {}