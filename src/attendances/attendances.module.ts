import { Module } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Attendance } from './attendance.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Attendance]), UsersModule],
  providers: [AttendancesService, UsersService],
  exports: [AttendancesService, TypeOrmModule],
})
export class AttendancesModule {}
