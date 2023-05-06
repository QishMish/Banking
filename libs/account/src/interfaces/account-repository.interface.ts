import { GroupedResult } from '@app/common';
import { BaseRepository } from '@app/common';
import { PaginationResult } from '@app/utils/types';

import { AccountEntity } from '../entities';
import { FindAccounts } from './account.interface';
import { SavingAccountType } from '../types';

interface AccountRepositoryExtension {
  findGroupedUserAccounts(userId: number): Promise<GroupedResult<AccountEntity>[]>;
  findAll(findOptions: FindAccounts): Promise<PaginationResult<AccountEntity>>;
  getSavingAccounts(type: SavingAccountType): Promise<AccountEntity[]>;
}

type AccountRepository = BaseRepository<AccountEntity> & AccountRepositoryExtension;

export { AccountRepository };
