import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

import { Action, HistoryEntity } from '@app/common';

import { AccountHistoryModel, AccountModel } from '../interfaces';
import { AccountStatus } from '../types';
import { AccountEntity } from './account.entity';

@Entity({ name: 'accountHistories', schema: 'public' })
class AccountHistoryEntity implements AccountHistoryModel, HistoryEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  public balance: number;

  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.ACTIVE })
  public status: AccountStatus;

  @ManyToOne(() => AccountEntity, (account) => account.histories)
  public account: AccountModel;

  @Column({ type: 'enum', enum: Action, default: Action.UPDATED })
  action: Action;

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

export { AccountHistoryEntity };
