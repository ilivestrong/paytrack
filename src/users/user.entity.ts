import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

export type SALARY_TYPE = 'monthly' | 'daily';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  salaryType: SALARY_TYPE;

  @Column('decimal')
  baseSalary: number;

  @OneToOne(() => Balance, (balance) => balance.user, {
    eager: true,
  })
  balance: Relation<Balance>;
}

@Entity('balances')
export class Balance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.balance, {
    eager: false,
  })
  @JoinColumn() // ✅ Move JoinColumn here to make Balance the FK owner
  user: Relation<User>;

  @Column('decimal')
  balance: number;

  @Index()
  @Column('timestamp')
  lastUpdated: Date;
}
