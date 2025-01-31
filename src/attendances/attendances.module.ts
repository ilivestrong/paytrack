import { Module } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { Attendance } from './attendance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Attendance])],
  providers: [AttendancesService, UsersService],
  exports: [AttendancesService],
})
export class AttendancesModule {}
