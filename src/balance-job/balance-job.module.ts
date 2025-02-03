import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JobProducerService } from './job-producer.service';
import {
  MonthlyUsersJobWorkerService,
  DailyUsersJobWorkerService,
} from './job-worker.service';
import { QUEUE_NAME } from 'src/shared/util';
import { BalancesModule } from 'src/balances/balances.module';
import { BalancesService } from 'src/balances/balances.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NAME.MONTHLY_USERS,
    }),
    BullModule.registerQueue({
      name: QUEUE_NAME.DAILY_USERS,
    }),
    BalancesModule,
  ],
  exports: [JobProducerService],
  providers: [
    JobProducerService,
    DailyUsersJobWorkerService,
    MonthlyUsersJobWorkerService,
    BalancesService,
  ],
})
export class BalanceJobModule {}
