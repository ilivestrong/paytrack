import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AppConfigModule } from 'src/config/app.config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance, User } from './user.entity';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forFeature([User, Balance])
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
