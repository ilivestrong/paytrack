import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AttendancesService } from 'src/attendances/attendances.service';
import { CompaniesService } from 'src/companies/companies.service';
import { UsersService } from 'src/users/users.service';

import { DATE_REFERNCE, getDate, QUEUE_NAME } from 'src/shared/util';
import { User } from 'src/users/user.entity';
import {
  BalanceJobBatch,
  JobProducerService,
} from 'src/balance-job/job-producer.service';
import * as dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';
import { childSend } from 'bullmq';

@Injectable()
export class BalanceUpdaterCronService {
  private readonly logger = new Logger(BalanceUpdaterCronService.name);
  private readonly jobBatchSize: number;

  private holidays = ['2025-02-05'];

  constructor(
    private companiesService: CompaniesService,
    private attendancesService: AttendancesService,
    private usersService: UsersService,
    private jobProducerService: JobProducerService,
    private configService: ConfigService,
  ) {
    this.jobBatchSize = this.configService.get<number>(
      'queueconfig.jobBatchSize',
    );
  }

  @Cron(CronExpression.EVERY_10_SECONDS, { disabled: false })
  async execute() {
    this.logger.debug(`updating balances now...`);

    const yesterday = getDate(DATE_REFERNCE.YESTERDAY);

    // TODO: Get public holidays

    const companies = await this.companiesService.findAll({ active: true });

    for (const { id } of companies) {
      let monthlyUsers: User[] = [];
      let dailyUsers: User[] = [];

      if (this.isHoliday(yesterday)) {
        const allCompanyUsers = await this.usersService.findByCompanyID({
          companyID: id,
        });

        monthlyUsers = allCompanyUsers.filter(
          (user) => user.salaryType === 'monthly',
        );

        // NOTE: daily users aren't paid on public holidays.
      } else {
        const yesterdayCheckins =
          await this.attendancesService.getCheckedInUsers({
            date: yesterday,
            companyID: id,
          });

        monthlyUsers = yesterdayCheckins
          .filter((checkin) => checkin.user.salaryType == 'monthly')
          .map((checkin) => checkin.user);

        dailyUsers = yesterdayCheckins
          .filter(
            (checkin) =>
              checkin.user.salaryType == 'daily' &&
              checkin.checkIn instanceof Date &&
              checkin.checkOut instanceof Date &&
              isDifferenceAtLeast9Hours(checkin.checkIn, checkin.checkOut),
          )
          .map((checkin) => checkin.user);
      }

      if (monthlyUsers.length > 0) {
        this.processUsers(monthlyUsers, QUEUE_NAME.MONTHLY_USERS);
      }

      if (dailyUsers.length > 0) {
        this.processUsers(dailyUsers, QUEUE_NAME.DAILY_USERS);
      }
    }
  }

  private processUsers(users: User[], queue: QUEUE_NAME) {
    const jobPayload = buildBatches(this.jobBatchSize, users);
    this.jobProducerService.produce(queue, jobPayload);
  }

  private isHoliday(date) {
    this.holidays;
    for (const d of this.holidays) {
      if (d === date) return true;
    }
    return false;
  }
}

/**
 * Create multiple batches of users for batch processing
 * */
function buildBatches(batchSize: number, source: User[]): BalanceJobBatch[] {
  const batches: BalanceJobBatch[] = [];

  for (let i = 0; i < source.length; i += batchSize) {
    const userBatch = source
      .slice(i, i + batchSize)
      .map((user) => user.id)
      .join(',');
    batches.push({
      userBatch,
      batchDate: getDate(DATE_REFERNCE.YESTERDAY),
      timestamp: new Date(),
    });
    return batches;
  }
}

function isDifferenceAtLeast9Hours(checkin: Date, checkout: Date): boolean {
  const diffInHours = dayjs(checkout).diff(dayjs(checkin), 'hour');
  return diffInHours >= 9;
}
