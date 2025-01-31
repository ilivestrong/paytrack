import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity('balances')
export class Balance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
