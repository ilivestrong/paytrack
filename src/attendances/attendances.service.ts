import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AttendanceDTO,
  GetCheckedinUsersFilterDTO,
} from './dto/attendance.dto';
import { UsersService } from 'src/users/users.service';
import { Attendance, ATTENDANCE_STATUS } from './attendance.entity';
import { getDate, isDuplicateError } from 'src/shared/util';

@Injectable()
export class AttendancesService {
  private readonly logger = new Logger(AttendancesService.name);
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private userService: UsersService,
  ) {}

  private async updateAttendanceStatus(
    attendance: AttendanceDTO,
    status: ATTENDANCE_STATUS,
  ) {
    try {
      const { userID } = attendance;
      const user = await this.userService.findByUserID({ userID });
      if (!user) {
        throw new NotFoundException(`user: ${userID} doesn't exists.`);
      }

      const userCheckin = this.attendanceRepository.create({
        user: {id: userID},
        checkIn: new Date(),
        date: getDate(),
        status,
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

  async checkin(attendance: AttendanceDTO) {
    return this.updateAttendanceStatus(attendance, 'present');
  }
  async applyLeave(attendance: AttendanceDTO) {
    return this.updateAttendanceStatus(attendance, 'leave');
  }
  async checkout(attendance: AttendanceDTO) {
    try {
      const { userID } = attendance;
      const user = await this.userService.findByUserID({ userID });
      if (!user) {
        throw new NotFoundException(`user: ${userID} doesn't exists.`);
      }

      const userAttendance = await this.attendanceRepository.findOneBy({
        user: { id: user.id },
        date: getDate(),
      });

      if (!userAttendance) {
        throw new BadRequestException(
          `No check-in registered for user ${userID} today.`,
        );
      }

      if (userAttendance.status === 'leave') {
        throw new BadRequestException(`user is on leave today`);
      }

      userAttendance.checkOut = new Date();
      return await this.attendanceRepository.save(userAttendance);
    } catch (error) {
      throw error;
    }
  }

  async getCheckedInUsers(filter: GetCheckedinUsersFilterDTO) {
    const { date, companyID } = filter;
    return await this.attendanceRepository.findBy({
      date,
      user: { company: { id: companyID } },
    });
  }
}
