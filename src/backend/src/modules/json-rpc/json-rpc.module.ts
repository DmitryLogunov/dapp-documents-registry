import {Module} from '@nestjs/common';

import {UsersModule} from "./resources/users/users.module";

@Module({
  imports: [UsersModule]
})
export class JsonRpcResourcesModule {
}