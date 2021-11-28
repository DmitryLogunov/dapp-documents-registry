import {TypeOrmModuleOptions} from '@nestjs/typeorm';

export const dappDocsRegistryConnectionName = 'DAPP_DOCS_REGISTRY_DATABASE_CONNECTION';
export type ConnectionOptions = TypeOrmModuleOptions & {
  factories?: string[];
  seeds?: string[];
};
