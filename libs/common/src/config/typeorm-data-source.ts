import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USER,
  password: process.env.DB_PASWORD,
  database: process.env.DB_NAME,
  logging: process.env.ENV === 'development' ? true : false,
  // dropSchema: true,
  // synchronize: true,
  migrationsRun: false,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
};

export default new DataSource(dataSourceOptions);
