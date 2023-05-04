import { Module } from '@nestjs/common';
import { AccountTransactionService } from './account-transaction.service';
import { TransactionLibModule } from '@app/transaction';
import { CommonModule } from '@app/common';
import { AccountLibModule } from '@app/account';

@Module({
  imports: [TransactionLibModule, CommonModule, AccountLibModule],
  providers: [AccountTransactionService],
  exports: [AccountTransactionService],
})
export class AccountTransactionModule {}
