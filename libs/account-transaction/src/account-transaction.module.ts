import { Module } from '@nestjs/common';

import { TransactionLibModule } from '@app/transaction';
import { CommonModule } from '@app/common';
import { AccountLibModule } from '@app/account';

import {
  UpdateBalanceTransaction,
  TransferMoneyTransaction,
  AcceptTransaction,
  DeclineTransaction,
  UpdateSavingAccountsTransaction
} from './repositories';
import { AccountTransactionService } from './services';

@Module({
  imports: [TransactionLibModule, CommonModule, AccountLibModule],
  providers: [
    AccountTransactionService,
    UpdateBalanceTransaction,
    TransferMoneyTransaction,
    AcceptTransaction,
    DeclineTransaction,
    UpdateSavingAccountsTransaction
  ],
  exports: [AccountTransactionService, UpdateBalanceTransaction, TransferMoneyTransaction, UpdateSavingAccountsTransaction]
})
export class AccountTransactionModule {}
