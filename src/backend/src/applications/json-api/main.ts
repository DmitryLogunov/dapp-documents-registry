import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as compression from 'compression';
import * as requestIp from 'request-ip';
import { AppModule } from './app.module';
import { LoggingService } from "@/libs/logging/services/logging.service";

const cors = require('cors');

require('dotenv').config(); // eslint-disable-line @typescript-eslint/no-var-requires

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = await app.resolve(LoggingService);

  const options = new DocumentBuilder()
    .setTitle('Dapp Documents Registry JSON-API')
    .setDescription('Dapp Documents Registry JSON-API')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
      )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.use(requestIp.mw());
  app.use(compression());

  app.use(cors({origin: '*'}));

  const port = process.env.BACKEND_HTTP_API_PORT || 3000;
  await app.listen(port);

  logger.log(`Dapp Documents Registry JSON-API service started on http://0.0.0.0:${port}`);
}
bootstrap();