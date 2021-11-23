import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as compression from 'compression';
import * as requestIp from 'request-ip';
import { AppModule } from './app.module';
import { LoggingService } from "@/libs/logging/services/logging.service";

require('dotenv').config(); // eslint-disable-line @typescript-eslint/no-var-requires

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = await app.resolve(LoggingService);

  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('Finances Application API')
    .setDescription('Finances Application API')
    .setVersion('1.0')
    .addTag('API')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
      )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.use(requestIp.mw());
  app.use(compression());

  const port = process.env.HTTP_PORT || 3000;
  await app.listen(port);

  logger.log(`Finances Application API service started on http://0.0.0.0:${port}`);
}
bootstrap();