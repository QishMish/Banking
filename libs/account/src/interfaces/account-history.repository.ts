import { BaseRepository } from '@app/common';

import { AccountHistoryEntity } from '../entities';

type AccountHistoryRepository = Pick<BaseRepository<AccountHistoryEntity>, 'create'>;

export { AccountHistoryRepository };
