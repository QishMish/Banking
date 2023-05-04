import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InterestModel } from '../interfaces';

@Entity({ name: 'interests', schema: 'public' })
class InterestEntity implements InterestModel {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'numeric', nullable: false })
  public rate: number;

  @Column({ type: 'smallint', nullable: false })
  public minMonth: number;

  @Column({ type: 'smallint', nullable: false })
  public maxMonth: number;

  @Column({ type: 'int', nullable: false })
  public minAmount: number;

  @Column({ type: 'int', nullable: false })
  public maxAmount: number;

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

export { InterestEntity };
