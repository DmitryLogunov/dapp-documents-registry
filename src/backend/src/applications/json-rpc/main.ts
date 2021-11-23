import {NestFactory} from '@nestjs/core';

import * as requestIp from 'request-ip';
import {AppModule} from './app.module';
import {LoggingService} from "@/libs/logging/services/logging.service";

require('dotenv').config(); // eslint-disable-line @typescript-eslint/no-var-requires

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = await app.resolve(LoggingService);

  app.setGlobalPrefix('rpc');
  app.use(requestIp.mw());

  const port = process.env.HTTP_PORT || 3000;
  await app.listen(port);

  logger.log(`Dapp Documents Registry JSON-RPC service started on http://0.0.0.0:${port}`);
}

bootstrap();