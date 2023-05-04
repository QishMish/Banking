import { DeepPartial } from '../types';
import { BaseEntityInterface } from './base-entity.interface';

export interface BaseRepository<T extends BaseEntityInterface> {
  create(entity: unknown): Promise<T>;
  find(findOptions: Partial<T>): Promise<T[] | []>;
  findOne(findOptions: DeepPartial<T>): Promise<T>;
  findById(id: number): Promise<T>;
  updateById(id: number, entity: Partial<T>): Promise<T>;
  deleteById(id: number): Promise<boolean>;
  softDeleteById(id: number): Promise<boolean>;
}
