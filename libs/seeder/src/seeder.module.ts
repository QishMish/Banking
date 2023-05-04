import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { InterestRateSeederModule } from './interestRates';

@Module({
  imports: [InterestRateSeederModule],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
