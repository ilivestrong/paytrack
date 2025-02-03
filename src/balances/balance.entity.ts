import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from 'typeorm';

@Entity('balances')
@Unique(['user', 'balanceDate'])
export class Balance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date')
  balanceDate: String;

  @OneToOne(() => User, (user) => user.balance, {
    eager: false,
  })
  @JoinColumn()
  user: Relation<User>;

  @Column('decimal', { scale: 2 })
  balance: number;

  @Index()
  @Column('timestamp')
  lastUpdated: Date;
}
