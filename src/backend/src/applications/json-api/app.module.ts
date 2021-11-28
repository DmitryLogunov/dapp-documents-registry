import {Module, NestModule, MiddlewareConsumer} from '@nestjs/common';
import {APP_FILTER} from "@nestjs/core";
import {Connection} from 'typeorm';

import {DatabaseModule} from "@/libs/database/database.module";
import {ResponseExceptionsFilter} from "@/libs/common/filters/response-exceptions.filter";
import {LoggingModule} from "@/libs/logging/logging.module";
import {AppLoggerMiddleware} from "@/libs/logging/middlewares/app-logger.middleware";

import {AuthenticationModule} from '@/modules/authentication/authentication.module';
import {JsonApiModule} from "@/modules/json-api/json-api.module";

@Module({
  imports: [
    DatabaseModule,
    LoggingModule.forRoot({serviceName: 'Dapp Document Registry\'s Cabinet API'}),
    AuthenticationModule,
    JsonApiModule,
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
  constructor(private connection: Connection) {}

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}