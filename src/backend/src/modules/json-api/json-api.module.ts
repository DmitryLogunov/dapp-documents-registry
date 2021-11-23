import { Module } from '@nestjs/common';

import {UsersModule} from "@/modules/json-api/resources/users/users.module";
import {UsersProfilesModule} from "@/modules/json-api/resources/users-profiles/users-profiles.module";

@Module({
  imports: [
    UsersModule,
    UsersProfilesModule
  ]
})
export class JsonApiModule {}