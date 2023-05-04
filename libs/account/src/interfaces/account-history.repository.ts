import { AccountHistoryEntity } from '../entities';
import { BaseRepository } from '@app/common';

type AccountHistoryRepository = Pick<
  BaseRepository<AccountHistoryEntity>,
  'create'
>;

export { AccountHistoryRepository };
