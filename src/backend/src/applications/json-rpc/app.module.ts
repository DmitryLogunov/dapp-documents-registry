import {Module, NestModule, MiddlewareConsumer} from '@nestjs/common';
import {APP_FILTER} from "@nestjs/core";
import {Connection} from 'typeorm';
import {JsonRpcModule} from '@jashkasoft/nestjs-json-rpc';

import {DatabaseModule} from "@/libs/database/database.module";
import {ResponseExceptionsFilter} from "@/libs/common/filters/response-exceptions.filter";
import {LoggingModule} from "@/libs/logging/logging.module";
import {AppLoggerMiddleware} from "@/libs/logging/middlewares/app-logger.middleware";

import {JsonRpcResourcesModule} from "@/modules/json-rpc/json-rpc.module";
import {AuthenticationModule} from "@/modules/authentication/authentication.module";

@Module({
  imports: [
    DatabaseModule,
    LoggingModule.forRoot({serviceName: 'Dapp Documents Registry API'}),
    JsonRpcModule.forRoot({
      path: '/rpc',
    }),
    AuthenticationModule,
    JsonRpcResourcesModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ResponseExceptionsFilter
    }
  ],
  controllers: []
})
export class AppModule implements NestModule {
  constructor(private connection: Connection) {
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}