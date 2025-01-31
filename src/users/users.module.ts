import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AppConfigModule } from 'src/config/app.config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

import { Balance } from 'src/balances/balance.entity';
import { AttendancesService } from 'src/attendances/attendances.service';
import { Attendance } from 'src/attendances/attendance.entity';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forFeature([User, Balance, Attendance]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AttendancesService],
  exports: [UsersService],
})
export class UsersModule {}
