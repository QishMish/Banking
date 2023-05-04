import { InterestModule } from '@app/interest';
import { Module } from '@nestjs/common';
import { InterestRateSeederService } from './interestRate.service';

@Module({
  imports: [InterestModule],
  providers: [InterestRateSeederService],
  exports: [InterestRateSeederService],
})
export class InterestRateSeederModule {}
