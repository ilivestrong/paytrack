import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_NAME } from 'src/shared/util';
import { BalanceJobBatch } from './job-producer.service';

@Processor(QUEUE_NAME.MONTHLY_USERS, { concurrency: 4 })
export class MonthlyUsersJobWorkerService extends WorkerHost {
  private logger = new Logger(MonthlyUsersJobWorkerService.name);

  constructor() {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.debug((job.data as BalanceJobBatch).userBatch.split(','));
    return {};
  }
}

@Processor(QUEUE_NAME.DAILY_USERS, { concurrency: 4 })
export class DailyUsersJobWorkerService extends WorkerHost {
  private logger = new Logger(DailyUsersJobWorkerService.name);

  constructor() {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.debug((job.data as BalanceJobBatch).userBatch.split(','));
    return {};
  }
}
