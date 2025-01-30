import { forwardRef } from '@nestjs/common';
import { UUID } from 'crypto';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type SALARY_TYPE = 'monthly' | 'daily';

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    salaryType: SALARY_TYPE;

    @Column("decimal")
    baseSalary: number;

    @OneToOne(() => Balance)
    @JoinColumn()
    balance: Balance;
}

@Entity("balances")
export class Balance {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    // @OneToOne(() => User, (user) => user.balance, { onDelete: "CASCADE" })
    // @JoinColumn({ name: "userID" }) // This is the foreign key column
    user: User;

    @Column("decimal")
    balance: number;

    @Index()
    @Column("timestamp")
    lastUpdated: Date;
}