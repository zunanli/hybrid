import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Package } from './entities/package.entity';
import { Version } from './entities/version.entity';
import { Mapping } from './entities/mapping.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hybrid',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  entities: [Package, Version, Mapping],
  migrations: [],
  subscribers: [],
});
