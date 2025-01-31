import {
  Body,
  Controller,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/user.dto';
import { AttendanceDTO } from '../attendances/dto/attendance.dto';
import { AttendancesService } from 'src/attendances/attendances.service';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private attendanceService: AttendancesService,
  ) {}

  @Post()
  async createUser(@Body() newUser: CreateUserDTO) {
    return this.userService.create(newUser);
  }

  @Post(':userID/checkin')
  async checkin(@Param() attendance: AttendanceDTO) {
    await this.attendanceService.checkin(attendance);
    return { success: true };
  }

  @Patch(':userID/checkout')
  async attendance(@Param() attendance: AttendanceDTO) {
    await this.attendanceService.checkout(attendance);
    return { success: true };
  }
}
