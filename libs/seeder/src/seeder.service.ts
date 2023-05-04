import { Injectable } from '@nestjs/common';
import { InterestRateSeederService } from './interestRates/interestRate.service';
import { Logger } from '@app/logger';

@Injectable()
export class SeederService {
  constructor(
    private readonly interestRatesSeederService: InterestRateSeederService,
    private readonly logger: Logger,
  ) {}
  public async seed(): Promise<void> {
    await this.interestRates()
      .then((completed) => {
        this.logger.log('Successfuly completed seeding interest rates...');
        Promise.resolve(completed);
      })
      .catch((error) => {
        this.logger.log('Failed seeding interest rates...');
        Promise.reject(error);
      });
  }

  private interestRates() {
    return this.interestRatesSeederService.bulkCreate();
  }
}
