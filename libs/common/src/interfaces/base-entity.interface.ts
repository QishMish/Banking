import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

interface BaseEntityInterface {
  id: number;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date;
}

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

export { BaseEntity, BaseEntityInterface };
