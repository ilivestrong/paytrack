import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_NAME } from 'src/shared/util';
import { BalanceJobBatch } from './job-producer.service';
import { BalancesService } from 'src/balances/balances.service';

@Processor(QUEUE_NAME.MONTHLY_USERS, { concurrency: 4 })
export class MonthlyUsersJobWorkerService extends WorkerHost {
  private logger = new Logger(MonthlyUsersJobWorkerService.name);

  constructor(private balancesService: BalancesService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const userIDs = (job.data as BalanceJobBatch).userBatch;
    await this.balancesService.calculateMonthlyUsersBalance(userIDs, false);
    return {};
  }
}

@Processor(QUEUE_NAME.DAILY_USERS, { concurrency: 4 })
export class DailyUsersJobWorkerService extends WorkerHost {
  private logger = new Logger(DailyUsersJobWorkerService.name);

  constructor(private balancesService: BalancesService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const userIDs = (job.data as BalanceJobBatch).userBatch;
    await this.balancesService.calculateDailyUsersBalance(userIDs, false);
    return {};
  }
}
