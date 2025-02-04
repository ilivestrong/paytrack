import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DBHOST'),
  port: configService.get<number>('DBPORT'),
  database: configService.get<string>('DATABASE'),
  username: configService.get<string>('USERNAME'),
  password: configService.get<string>('PASSWORD'),
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: true,
  migrations: [__dirname + '/../database/migrations/*.{ts,js}'],
  migrationsRun: false,
  logging: true,
});

export default AppDataSource;