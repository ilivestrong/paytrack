import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JobProducerService } from './job-producer.service';
import {
  MonthlyUsersJobWorkerService,
  DailyUsersJobWorkerService,
} from './job-worker.service';
import { QUEUE_NAME } from 'src/shared/util';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NAME.MONTHLY_USERS,
    }),
    BullModule.registerQueue({
      name: QUEUE_NAME.DAILY_USERS,
    }),
  ],
  exports: [JobProducerService],
  providers: [
    JobProducerService,
    DailyUsersJobWorkerService,
    MonthlyUsersJobWorkerService,
  ],
})
export class BalanceJobModule {}
