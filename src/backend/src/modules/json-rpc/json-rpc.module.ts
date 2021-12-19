import {Module} from '@nestjs/common';

import {UsersModule} from "./resources/users/users.module";
import {TokensModule} from "./resources/tokens/tokens.module";

@Module({
  imports: [TokensModule, UsersModule]
})
export class JsonRpcResourcesModule {
}