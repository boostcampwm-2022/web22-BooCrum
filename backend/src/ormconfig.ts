import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
export const config: DataSourceOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [join(__dirname, '/**/*.entity{.ts,.js}')],
  migrations: [
    process.env.NODE_ENV !== 'develop' && process.env.NODE_ENV !== 'production'
      ? 'migrations/**/*.ts'
      : 'dist/migrations/**/*.js',
  ],
  migrationsTableName: 'migrations',
  synchronize: process.env.NODE_ENV === 'develop',
};
export default new DataSource(config);
