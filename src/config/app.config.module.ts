import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DBConfig, QueueConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DBConfig, QueueConfig],
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
