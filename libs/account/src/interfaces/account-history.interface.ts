import { BaseEntityInterface } from '@app/common';

import { AccountModel } from './account.interface';
import { AccountStatus } from '../types';

interface AccountHistory {
  balance: number;
  status: AccountStatus;
}

interface AccountHistoryModel extends AccountHistory, BaseEntityInterface {
  account: AccountModel;
}

export { AccountHistory, AccountHistoryModel };
