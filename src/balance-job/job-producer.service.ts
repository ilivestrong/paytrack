import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { DATE_REFERNCE, getDate, QUEUE_NAME } from 'src/shared/util';

@Injectable()
export class JobProducerService implements OnModuleInit {
  private logger = new Logger(JobProducerService.name);
  constructor(
    @InjectQueue(QUEUE_NAME.MONTHLY_USERS)
    private monthlyUsersQueue: Queue,

    @InjectQueue(QUEUE_NAME.DAILY_USERS)
    private dailyUsersQueue: Queue,
  ) {}

  async onModuleInit() {
    // await this.redisClient.set('processed_batches', 0);
  }

  /**
   * Push each batch as separate job to respective queue
   * @param queue - name of the queue to which job has to be queued
   * @param batches - user batches to be processes as part of per job
   */
  produce(queue: QUEUE_NAME, batches: BalanceJobBatch[]) {
    if (!batches.length) {
      this.logger.warn(`No batches to process for queue: ${queue}`);
      return;
    }

    const queueInstance =
      queue === QUEUE_NAME.MONTHLY_USERS
        ? this.monthlyUsersQueue
        : this.dailyUsersQueue;

    batches.forEach((batch, idx) => {
      queueInstance.add(`${batch.batchDate}/batch-${idx + 1}`, batch);
    });

    this.logger.log(`Pushed ${batches.length} batches to ${queue}`);
  }
}

export interface BalanceJobBatch {
  userBatch: string;
  batchDate: string;
  timestamp: Date;
}
