import { BaseRepository } from '@app/common';
import { UserEntity } from '../entities';
import { FindUsers } from './user.interface';
import { PaginationResult } from '@app/utils';

interface findUserRepositoryExtension {
  findAll(options: FindUsers): Promise<PaginationResult<UserEntity>>;
}

type UserRepository = BaseRepository<UserEntity> & findUserRepositoryExtension;

export { UserRepository };
