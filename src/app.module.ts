import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { AppConfigModule } from './config/app.config.module';

@Module({
  imports: [UsersModule, AppConfigModule],
  exports: [AppConfigModule],
})
export class AppModule {}
  