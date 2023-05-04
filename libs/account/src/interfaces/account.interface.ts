import { UserModel } from '@app/user';
import { TransactionPurpose, TransactionType } from '@app/transaction';
import { TransactionModel } from '@app/transaction';
import { BaseEntityInterface } from '@app/common';
import { PaginationProps } from '@app/utils';
import { AccountStatus, AccountTypeEnum } from '../types';
import { AccountParams, AccountParamsModel } from './account-params.interface';

interface CreateAccountInput {
  userId: number;
  type: AccountTypeEnum;
  status?: AccountStatus;
  params?: AccountParams;
}

interface FindAccounts extends PaginationProps {
  id?: number;
  iban?: string;
  status?: AccountStatus;
  type?: AccountTypeEnum;
  userId?: number;
  skip?: number;
  limit?: number;
}

interface TransferMoneyInput {
  userId: number;
  sourceAccountIban: string;
  destinationAccountIban: string;
  amount: number;
  type: TransactionType;
  purpose: TransactionPurpose;
}

interface Account {
  iban: string;
  balance: number;
  status?: AccountStatus;
  type?: AccountTypeEnum;
}

interface AccountModel extends Account, BaseEntityInterface {
  user: UserModel;
  type: AccountTypeEnum;
  outgoingTransactions: TransactionModel[];
  incomingTransactions: TransactionModel[];
  params?: AccountParamsModel;
}

export {
  Account,
  AccountModel,
  CreateAccountInput,
  TransferMoneyInput,
  FindAccounts,
};
