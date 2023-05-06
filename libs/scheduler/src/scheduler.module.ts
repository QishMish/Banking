import { Module } from '@nestjs/common';

import { ScheduleModule } from '@nestjs/schedule';
import { AccountLibModule } from '@app/account';
import { CommonModule } from '@app/common';

import { SchedulerService } from './services';
import { AccountTransactionModule } from '@app/account-transaction';

@Module({
  imports: [ScheduleModule.forRoot(), AccountLibModule, CommonModule, AccountTransactionModule],
  providers: [SchedulerService],
  exports: [SchedulerService]
})
export class SchedulerLibModule {}
