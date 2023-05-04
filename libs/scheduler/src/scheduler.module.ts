import { Module } from '@nestjs/common';
import { SchedulerService } from './services';
import { ScheduleModule } from '@nestjs/schedule';
import { AccountLibModule } from '@app/account';
import { CommonModule } from '@app/common';

@Module({
  imports: [ScheduleModule.forRoot(), AccountLibModule, CommonModule],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerLibModule {}
