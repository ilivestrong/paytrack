import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { AppConfigModule } from './config/app.config.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigService } from '@nestjs/config';
import { User } from './users/user.entity';
import { BalancesModule } from './balances/balances.module';
import { Balance } from './balances/balance.entity';
import { AttendancesModule } from './attendances/attendances.module';
import { Attendance } from './attendances/attendance.entity';
import { CompaniesModule } from './companies/companies.module';
import { Company } from './companies/company.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { BalanceUpdaterCronService } from './balances/balance-updater-cron.service';
import { BullModule } from '@nestjs/bullmq';
import { BalanceJobModule } from './balance-job/balance-job.module';
import {
  DailyUsersJobWorkerService,
  MonthlyUsersJobWorkerService,
} from './balance-job/job-worker.service';
import { BalancesService } from './balances/balances.service';

@Module({
  imports: [
    UsersModule,
    AppConfigModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('dbconfig.host'),
        port: configService.get<number>('dbconfig.port'),
        database: configService.get<string>('dbconfig.database'),
        username: configService.get<string>('dbconfig.username'),
        password: configService.get<string>('dbconfig.password'),
        autoLoadEntities: true,
        entities: [User, Balance, Company, Attendance],
        synchronize: true,
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('queueconfig.redisHost'),
          port: configService.get<number>('queueconfig.redisPort'),
        },
        defaultJobOptions: {
          removeOnComplete: true,
        },
      }),
    }),

    BalancesModule,
    AttendancesModule,
    CompaniesModule,
    BalanceJobModule,
  ],
  exports: [AppConfigModule],
  providers: [
    BalanceUpdaterCronService,
    DailyUsersJobWorkerService,
    MonthlyUsersJobWorkerService,
    BalancesService,
  ],
})
export class AppModule {}
