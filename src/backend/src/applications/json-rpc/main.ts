import {NestFactory} from '@nestjs/core';

import swaggerUI = require('swagger-ui-express');
import * as requestIp from 'request-ip';
import {LoggingService} from "@/libs/logging/services/logging.service";
import {getDirectoryFilesList} from "@/libs/common/helpers/files.helpers";
import {AppModule} from './app.module';

const cors = require('cors');

require('dotenv').config(); // eslint-disable-line @typescript-eslint/no-var-requires

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = await app.resolve(LoggingService);

  app.setGlobalPrefix('rpc');
  app.use(requestIp.mw());

  app.use(cors({origin: '*'}));

  const swDocument = require(`${process.cwd()}/assets/swagger/json-rpc-swagger.json`); // eslint-disable-line @typescript-eslint/no-var-requires
  const resourceSwFilesPath = `assets/swagger/resources`;
  const files = await getDirectoryFilesList(resourceSwFilesPath);
  for await (const filename of files) {
    const {tags, paths, definitions} = require(`${process.cwd()}/${resourceSwFilesPath}/${filename}`); // eslint-disable-line @typescript-eslint/no-var-requires
    swDocument.tags = [ ...swDocument.tags, ...tags];
    for (const [section, data] of [['paths', paths], ['definitions', definitions]]) {
      swDocument[section] = { ...swDocument[section], ...data };
    }
  }

  app.use('/rpc/api-docs', swaggerUI.serve, swaggerUI.setup(swDocument));

  const port = process.env.BACKEND_HTTP_RPC_PORT || 3001;
  await app.listen(port);

  logger.log(`NFT Oracles Registry JSON-RPC service started on http://0.0.0.0:${port}`);
}

bootstrap();