import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionLibModule } from '@app/transaction';
import { AccountTransactionModule } from '@app/account-transaction';

@Module({
  imports: [TransactionLibModule, AccountTransactionModule],
  controllers: [TransactionController],
})
export class TransactionModule {}
