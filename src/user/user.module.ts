import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserLibModule } from '@app/user';
import { AccountLibModule } from '@app/account';
import { TransactionLibModule } from '@app/transaction';

@Module({
  imports: [UserLibModule, AccountLibModule, TransactionLibModule],
  controllers: [UserController],
})
export class UserModule {}
