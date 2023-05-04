import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity, UserModel } from '@app/user';
import { TransactionEntity, TransactionModel } from '@app/transaction';
import {
  AccountHistoryModel,
  AccountModel,
  AccountParamsModel,
} from '../interfaces';
import { AccountStatus, AccountTypeEnum } from '../types';
import { AccountParamsEntity } from './account-params.entity';
import { AccountHistoryEntity } from './account-history.entity';

@Entity({ name: 'accounts', schema: 'public' })
class AccountEntity implements AccountModel {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', nullable: false })
  public iban: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  public balance: number;

  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.ACTIVE })
  public status: AccountStatus;

  @Column({
    type: 'enum',
    enum: AccountTypeEnum,
    nullable: false,
  })
  public type: AccountTypeEnum;

  @ManyToOne(() => UserEntity, (user) => user.accounts)
  public user: UserModel;

  @OneToOne(() => AccountParamsEntity)
  @JoinColumn()
  public params?: AccountParamsModel;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.sourceAcc, {
    eager: true,
  })
  public outgoingTransactions: TransactionModel[];

  @OneToMany(
    () => TransactionEntity,
    (transaction) => transaction.destinationAcc,
    {
      createForeignKeyConstraints: true,
      cascade: true,
      eager: true,
    },
  )
  public incomingTransactions: TransactionModel[];

  @OneToMany(() => AccountHistoryEntity, (histories) => histories)
  public histories: AccountHistoryModel[];

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

export { AccountEntity };
