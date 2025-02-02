import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JobProducerService } from './job-producer.service';
import { JobWorkerService } from './job-worker.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'monthly_users',
    }),
    BullModule.registerQueue({
      name: 'daily_users',
    }),
  ],
  exports: [JobProducerService],
  providers: [JobProducerService, JobWorkerService],
})
export class BalanceJobModule {}
