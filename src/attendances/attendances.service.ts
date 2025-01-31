import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { AttendanceDTO } from './dto/attendance.dto';
import { UsersService } from 'src/users/users.service';
import { Attendance } from './attendance.entity';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private userService: UsersService,
  ) {}

  async checkin(attendance: AttendanceDTO) {
    try {
      const { userID } = attendance;
      const user = await this.userService.findByUserID(userID);
      if (!user) {
        throw new NotFoundException(`user: ${userID} doesn't exists.`);
      }

      const userCheckin = this.attendanceRepository.create({
        user,
        checkIn: new Date(),
        date: today(),
      });

      return await this.attendanceRepository.save(userCheckin);
    } catch (error) {
      if (isDuplicateError(error)) {
        throw new ConflictException(
          `user: {${attendance.userID}} has already checked-in for today.`,
        );
      }
      throw error;
    }
  }

  async checkout(attendance: AttendanceDTO) {
    try {
      const { userID } = attendance;
      const user = await this.userService.findByUserID(userID);
      if (!user) {
        throw new NotFoundException(`user: ${userID} doesn't exists.`);
      }

      const checkIn = await this.attendanceRepository.findOneBy({
        user,
        date: today(),
      });

      if (!checkIn) {
        throw new BadRequestException(
          `No check-in registered for user ${userID} today.`,
        );
      }

      await this.attendanceRepository.update(
        { user, date: today() },
        {
          checkOut: new Date(),
        },
      );
    } catch (error) {
      throw error;
    }
  }
}

function today() {
  //   return new Date().toISOString().split('T')[0];
  const localDateTime = convertUTCDateToLocalDate(new Date());
  return localDateTime.toISOString().split('T')[0];
}

function convertUTCDateToLocalDate(date) {
  var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;
}

function isDuplicateError(error: Error): boolean {
  return (
    error instanceof QueryFailedError &&
    (error as QueryFailedError).message.includes('duplicate key value')
  );
}
