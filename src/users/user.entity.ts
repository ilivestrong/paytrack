import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Balance } from './balance.entity';
import { Attendance } from './attendance.entity';

export type SALARY_TYPE = 'monthly' | 'daily';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Index()
  @Column()
  salaryType: SALARY_TYPE;

  @Column('decimal')
  baseSalary: number;

  @OneToOne(() => Balance, (balance) => balance.user, {
    eager: true,
  })
  balance: Relation<Balance>;

  @OneToMany(() => Attendance, (attendance) => attendance.user, {
    eager: false,
  })
  attendance: Relation<Attendance>[];
}
