import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountEntity, AccountModel } from '@app/account';
import { UserEntity, UserModel } from '@app/user';
import { TransactionType, TransactionStatus } from '../types';
import { TransactionModel } from '../interfaces';

@Entity({ name: 'transactions', schema: 'public' })
class TransactionEntity implements TransactionModel {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'int', nullable: false })
  public amount: number;

  @Column({ type: 'enum', enum: TransactionType, nullable: false })
  public type: TransactionType;

  @Column({ type: 'enum', enum: TransactionStatus, nullable: false })
  public status: TransactionStatus;

  @ManyToOne(() => UserEntity, (user) => user.transactions)
  public user: UserModel;

  @ManyToOne('AccountEntity', {
    nullable: true,
  })
  public sourceAcc?: AccountModel;

  @ManyToOne('AccountEntity')
  public destinationAcc: AccountModel;

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

export { TransactionEntity };
