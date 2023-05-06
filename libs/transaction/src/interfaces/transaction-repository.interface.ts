import { PaginationResult } from '@app/utils';
import { BaseRepository } from '@app/common';

import { TransactionEntity } from '../entities';
import { FindTransactions } from './transaction.interface';

interface TransactionRepositoryExtention {
  findUserTransactions(userId: number): Promise<TransactionEntity[] | []>;
  findAll(findOptions: FindTransactions): Promise<PaginationResult<TransactionEntity>>;
}

type TransactionRepository = BaseRepository<TransactionEntity> & TransactionRepositoryExtention;

export { TransactionRepository };
