import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AppConfigModule } from 'src/config/app.config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Balance } from './balance.entity';
import { Attendance } from './attendance.entity';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forFeature([User, Balance, Attendance]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule],
})
export class UsersModule {}
