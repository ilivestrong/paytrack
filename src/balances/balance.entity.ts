import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
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

  @ManyToOne(() => User, (user) => user.attendances, { eager: true })
  @JoinColumn()
  user: Relation<User>;

  @Column('decimal', { scale: 2 })
  balance: number;

  @Index()
  @Column('timestamp')
  lastUpdated: Date;
}
