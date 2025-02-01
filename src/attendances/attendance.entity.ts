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

export type ATTENDANCE_STATUS = 'present' | 'leave';

@Entity('attendances')
@Unique(['user', 'date'])
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.attendances)
  @JoinColumn()
  user: Relation<User>;

  @Column('date')
  date: String;

  @Column()
  status: ATTENDANCE_STATUS;

  @Column({ type: 'timestamp', nullable: false })
  checkIn: Date;

  @Column({ type: 'timestamp', nullable: true })
  checkOut: Date;
}
