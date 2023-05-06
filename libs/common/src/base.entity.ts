import { Column, CreateDateColumn, DeleteDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { BaseEntityInterface } from './interfaces';

abstract class BaseEntity implements BaseEntityInterface {
  @Column()
  @PrimaryColumn()
  readonly id: number;

  @UpdateDateColumn()
  readonly createdAt: Date;

  @CreateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  readonly deletedAt: Date;
}

export { BaseEntity };
