import { BaseRepository } from '@app/common';

import { PaginationResult } from '@app/utils';

import { UserEntity } from '../entities';
import { FindUsers } from './user.interface';

interface findUserRepositoryExtension {
  findAll(options: FindUsers): Promise<PaginationResult<UserEntity>>;
}

type UserRepository = BaseRepository<UserEntity> & findUserRepositoryExtension;

export { UserRepository };
