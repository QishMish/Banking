import { TransactionModel } from '@app/transaction';
import { BaseEntityInterface } from '@app/common';
import { PaginationProps } from '@app/utils';
import { AccountModel } from '@app/account';
import { Role, UserStatuses } from '../types';

interface FindUsers extends PaginationProps {
  id?: number;
  email?: string;
  status?: UserStatuses;
  identityNumber?: string;
  role?: Role;
  skip?: number;
  limit?: number;
}

interface User {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phone: string;
  phoneCode: string;
  phoneNumber: string;
  identityNumber: string;
  role?: Role;
  birthDate?: Date | null;
  status?: UserStatuses;
  refreshToken?: string;
}

interface UserModel extends User, BaseEntityInterface {
  accounts: AccountModel[];
  transactions: TransactionModel[];
}

export { User, UserModel, FindUsers };
