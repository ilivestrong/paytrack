import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from './user.entity';

@Entity('balances')
export class Balance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.balance, {
    eager: false,
  })
  @JoinColumn()
  user: Relation<User>;

  @Column('decimal')
  balance: number;

  @Index()
  @Column('timestamp')
  lastUpdated: Date;
}
