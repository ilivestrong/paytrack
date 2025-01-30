import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AppConfigModule } from 'src/config/app.config.module';

@Module({
  imports: [
    AppConfigModule,
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
