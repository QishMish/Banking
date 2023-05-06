import { Module } from '@nestjs/common';

import { TransactionLibModule } from '@app/transaction';
import { AccountTransactionModule } from '@app/account-transaction';

import { TransactionController } from './transaction.controller';
@Module({
  imports: [TransactionLibModule, AccountTransactionModule],
  controllers: [TransactionController]
})
export class TransactionModule {}
