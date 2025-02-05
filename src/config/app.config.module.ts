import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CronConfig, DBConfig, QueueConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DBConfig, QueueConfig, CronConfig],
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
