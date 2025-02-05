import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from 'typeorm';

import { Balance } from 'src/balances/balance.entity';
import { Attendance } from 'src/attendances/attendance.entity';
import { IsEmail } from 'class-validator';
import { Company } from 'src/companies/company.entity';
import { BaseEntity } from 'src/shared/base.entity';

export type SALARY_TYPE = 'monthly' | 'daily';

@Entity('users')
@Unique(['name', 'email'])
export class User extends BaseEntity {
  @Column()
  name: string;

  @IsEmail()
  @Column()
  email: string;

  @Index()
  @Column()
  salaryType: SALARY_TYPE;

  @Column('decimal', { scale: 2 })
  salaryOrDailyRate: number;

  @OneToMany(() => Balance, (balance) => balance.user, {
    eager: false,
  })
  balances: Relation<Balance>[];

  @OneToMany(() => Attendance, (attendance) => attendance.user, {
    eager: false,
  })
  attendances: Relation<Attendance>[];

  @ManyToOne(() => Company, (company) => company.users, { nullable: false })
  @JoinColumn()
  company: Relation<Company>;
}
