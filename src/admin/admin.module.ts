import { Module } from '@nestjs/common';

import { UserLibModule } from '@app/user';
import { TransactionLibModule } from '@app/transaction';
import { AccountLibModule } from '@app/account';
import { AccountTransactionModule } from '@app/account-transaction';

import { AdminController } from './admin.controller';

@Module({
  imports: [UserLibModule, TransactionLibModule, AccountLibModule, AccountTransactionModule],
  controllers: [AdminController]
})
export class AdminModule {}
