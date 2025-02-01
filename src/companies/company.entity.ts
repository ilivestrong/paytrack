import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from 'typeorm';

import { IsOptional } from 'class-validator';
import { User } from 'src/users/user.entity';

@Entity('companies')
@Unique(['name'])
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @IsOptional()
  @Column({ default: true })
  active: boolean;

  @OneToMany(() => User, (user) => user.company, {
    eager: false,
  })
  users: Relation<User>[];
}
