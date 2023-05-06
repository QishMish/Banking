import { Module } from '@nestjs/common';

import { AccountLibModule } from '@app/account';
import { AccountTransactionModule } from '@app/account-transaction';

import { AccountController } from './account.controller';

@Module({
  imports: [AccountLibModule, AccountTransactionModule],
  controllers: [AccountController],
  providers: []
})
export class AccountModule {}
