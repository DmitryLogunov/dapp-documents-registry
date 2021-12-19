import {Module} from '@nestjs/common';

import {LoggingModule} from "@/libs/logging/logging.module";
import {TokensRegistryContractClientModule} from "@/libs/contracts/tokens-registry-contract-client";
import {TokensHandler} from "./handlers/tokens.handler";
import {ConfigModule} from "@nestjs/config";
import TokensRegistryContractConfigurationFactory
  from "@/libs/contracts/tokens-registry-contract-client/factories/tokens-registry-client-configuration.factory";
import {TokensService} from "./services/tokens.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {TokensEntity} from "@/libs/database/entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([TokensEntity]),
    ConfigModule.forFeature(TokensRegistryContractConfigurationFactory),
    TokensRegistryContractClientModule,
    LoggingModule.forRoot({serviceName: 'Users RPC module'})
  ],
  providers: [TokensHandler, TokensService]
})
export class TokensModule {
}
