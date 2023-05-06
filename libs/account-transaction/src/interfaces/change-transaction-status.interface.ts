import { TransactionStatus } from '@app/transaction';

interface ChangeTransactionStatusData {
  id: number;
}

interface ChangedTransactionStatus {
  status: TransactionStatus;
}

export { ChangeTransactionStatusData, ChangedTransactionStatus };
