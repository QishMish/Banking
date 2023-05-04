import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SavingAccountStatus, SavingAccountType } from '../types';
import { AccountParamsModel } from '../interfaces';

@Entity({ name: 'accountParams', schema: 'public' })
class AccountParamsEntity implements AccountParamsModel {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'enum',
    enum: SavingAccountType,
    default: SavingAccountType.FIXED_DEPOSIT,
  })
  public type: SavingAccountType;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  public interestRate: number;

  @Column({ type: 'int', nullable: false, default: 6 })
  public term: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  public amount: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  public interestAmount: number;

  @Column({
    type: 'enum',
    enum: SavingAccountStatus,
    default: SavingAccountStatus.OPEN,
  })
  public status: SavingAccountStatus;

  @Column({ type: 'timestamp', nullable: true })
  public nextInterestPayDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  public lastInterestPayDate: Date;

  @Column({ type: 'int', nullable: false, default: 0 })
  public interestPayCount: number;

  @Exclude()
  @CreateDateColumn()
  public createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  public updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  public deletedAt: Date;
}

export { AccountParamsEntity };
