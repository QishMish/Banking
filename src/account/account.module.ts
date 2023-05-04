import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountLibModule } from '@app/account';

@Module({
  imports: [AccountLibModule],
  controllers: [AccountController],
  providers: [],
})
export class AccountModule {}
