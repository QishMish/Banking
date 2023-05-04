import { BaseEntityInterface } from '@app/common';
import { SavingAccountStatus, SavingAccountType } from '../types';

interface AccountParams {
  type: SavingAccountType;
  amount: number;
  term: number;
  lastInterestPayDate?: Date;
  nextInterestPayDate?: Date;
  interestPayCount?: number;
}

interface AccountParamsModel extends AccountParams, BaseEntityInterface {
  interestAmount: number;
  status: SavingAccountStatus;
  interestRate: number;
}

export { AccountParams, AccountParamsModel };
