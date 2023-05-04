import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { AccountModel } from '@app/account/interfaces';
import { TransactionEntity, TransactionModel } from '@app/transaction';
import { Role, UserStatuses } from '../types';
import { UserModel } from '../interfaces/user.interface';

@Entity({ name: 'users', schema: 'public' })
class UserEntity implements UserModel {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', nullable: false })
  public username: string;

  @Column({ type: 'varchar', nullable: false })
  public email: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: false })
  public password: string;

  @Column({ type: 'varchar', nullable: false })
  public firstname: string;

  @Column({ type: 'varchar', nullable: false })
  public lastname: string;

  @Column({ type: 'varchar', nullable: false })
  public phone: string;

  @Column({ type: 'varchar', nullable: false })
  public phoneCode: string;

  @Column({ type: 'varchar', nullable: false })
  public phoneNumber: string;

  @Column({ type: 'varchar', nullable: false })
  public identityNumber: string;

  @Column({ type: 'date', nullable: true })
  public birthDate: Date;

  @Column({ type: 'enum', enum: UserStatuses, default: UserStatuses.PENDING })
  public status: UserStatuses;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  public role: Role;

  @Exclude()
  @Column({ type: 'varchar', nullable: true })
  public refreshToken: string;

  @OneToMany(() => TransactionEntity, (transactions) => transactions.user)
  public transactions: TransactionModel[];

  @OneToMany('AccountEntity', (accounts: AccountModel) => accounts.user)
  public accounts: AccountModel[];

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

export { UserEntity };
