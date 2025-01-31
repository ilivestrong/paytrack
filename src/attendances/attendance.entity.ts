import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from 'typeorm';

@Entity('attendances')
@Unique(['user', 'date'])
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.attendance)
  @JoinColumn()
  user: Relation<User>;

  @Column('date')
  date: String;

  @Column({ type: 'timestamp', nullable: false })
  checkIn: Date;

  @Column({ type: 'timestamp', nullable: true })
  checkOut: Date;
}
