import { Module } from '@nestjs/common';

import { InterestModule } from '@app/interest';

import { InterestRateSeederService } from './interestRate.service';

@Module({
  imports: [InterestModule],
  providers: [InterestRateSeederService],
  exports: [InterestRateSeederService]
})
export class InterestRateSeederModule {}
