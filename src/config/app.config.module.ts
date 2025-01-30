import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import dbconfig from '../config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbconfig],
    }),
  ],
  exports:[ConfigModule]
})
export class AppConfigModule {}
