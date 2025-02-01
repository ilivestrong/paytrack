import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from 'typeorm';

import { Balance } from 'src/balances/balance.entity';
import { Attendance } from 'src/attendances/attendance.entity';
import { IsEmail } from 'class-validator';
import { Company } from 'src/companies/company.entity';

export type SALARY_TYPE = 'monthly' | 'daily';

@Entity('users')
@Unique(['name', 'email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @IsEmail()
  @Column()
  email: string;

  @Index()
  @Column()
  salaryType: SALARY_TYPE;

  @Column('decimal', { scale: 2 })
  baseSalary: number;

  @OneToOne(() => Balance, (balance) => balance.user, {
    eager: true,
  })
  balance: Relation<Balance>;

  @OneToMany(() => Attendance, (attendance) => attendance.user, {
    eager: false,
  })
  attendances: Relation<Attendance>[];

  @ManyToOne(() => Company, (company) => company.users)
  @JoinColumn()
  company: Relation<Company>;
}
