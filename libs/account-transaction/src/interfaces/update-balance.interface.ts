import { UpdateBalance } from '@app/account';
import { TransactionStatus } from '@app/transaction';

interface AccountData {
  iban: string;
  userId: number;
  amount: number;
  type: UpdateBalance;
}

interface TransferData {
  userId: number;
  sourceAccountIban: string;
  destinationAccountIban: string;
  amount: number;
}

interface TransactionStatusInterface {
  status: TransactionStatus;
}

interface UserWithBalance extends TransactionStatusInterface {
  userId: number;
  balance: number;
}

interface TransferedMoney extends TransactionStatusInterface {
  userId: number;
  destinationAccIban: string;
  amount: number;
}

export { AccountData, UserWithBalance, TransferData, TransferedMoney };
