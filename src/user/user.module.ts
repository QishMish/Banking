import { Module } from '@nestjs/common';

import { UserLibModule } from '@app/user';
import { AccountLibModule } from '@app/account';
import { TransactionLibModule } from '@app/transaction';

import { UserController } from './user.controller';

@Module({
  imports: [UserLibModule, AccountLibModule, TransactionLibModule],
  controllers: [UserController]
})
export class UserModule {}
