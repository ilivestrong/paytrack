import { Module } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { AttendancesModule } from 'src/attendances/attendances.module';
import { AttendancesService } from 'src/attendances/attendances.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [UsersModule, AttendancesModule, TypeOrmModule.forFeature([User])],
  providers: [BalancesService, AttendancesService, UsersService, ConfigService],
})
export class BalancesModule {}
