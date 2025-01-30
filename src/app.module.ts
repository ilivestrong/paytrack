import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { AppConfigModule } from './config/app.config.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigService } from '@nestjs/config';
import { User, Balance } from './users/user.entity';

@Module({
  imports: [
    UsersModule,
    AppConfigModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('dbconfig.host'),
        port: configService.get<number>('dbconfig.port'),
        database: configService.get<string>('dbconfig.database'),
        username: configService.get<string>('dbconfig.username'),
        password: configService.get<string>('dbconfig.password'),
        autoLoadEntities: true,
        entities: [User, Balance],
        synchronize: true,
      }),
    }),
  ],
  exports: [AppConfigModule],
})
export class AppModule {}
