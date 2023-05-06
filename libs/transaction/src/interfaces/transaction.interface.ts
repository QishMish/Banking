import { AccountModel } from '@app/account';
import { BaseEntityInterface } from '@app/common';
import { PaginationProps } from '@app/utils';
import { UserModel } from '@app/user';

import { TransactionStatus, TransactionType } from '../types';

interface FindTransactions extends PaginationProps {
  id?: number;
  type?: TransactionType;
  status?: TransactionStatus;
  userId?: number;
  sourceAccId?: number;
  destinationAccId?: number;
  skip?: number;
  limit?: number;
}

interface Transaction {
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  userId?: number;
  sourceAccId?: number;
  destinationAccId?: number;
}

interface TransactionModel extends Transaction, BaseEntityInterface {
  user: UserModel;
  sourceAcc?: AccountModel;
  destinationAcc: AccountModel;
}

export { Transaction, TransactionModel, FindTransactions };
