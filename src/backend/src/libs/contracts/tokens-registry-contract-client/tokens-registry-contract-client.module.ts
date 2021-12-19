import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";

import TokensRegistryContractConfigurationFactory from "./factories/tokens-registry-client-configuration.factory";
import { tokensRegistryContractClientProvider } from "./providers/tokens-registry-contract-client.provider";
import { LoggingModule } from "@/libs/logging/logging.module";

@Module({
  imports: [
    ConfigModule.forFeature(TokensRegistryContractConfigurationFactory)
  ],
  providers: [
    tokensRegistryContractClientProvider
  ],
  exports: [
    tokensRegistryContractClientProvider
  ]
})
export class TokensRegistryContractClientModule {}
