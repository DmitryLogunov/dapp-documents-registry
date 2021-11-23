import {TypeOrmModuleOptions} from '@nestjs/typeorm';

export const protekConnectionName = 'PROTEK_DATABASE_CONNECTION';
export type ConnectionOptions = TypeOrmModuleOptions & {
  factories?: string[];
  seeds?: string[];
};
