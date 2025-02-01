import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company, User]), UsersModule],
  controllers: [CompaniesController],
  providers: [CompaniesService, UsersService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
