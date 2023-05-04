import { Inject, Injectable } from '@nestjs/common';
import { interestRates } from './data';
import { SEEDER_REPOSITORY } from '../contants';
import { SeederRepository } from '../interfaces';

@Injectable()
export class InterestRateSeederService {
  constructor(
    @Inject(SEEDER_REPOSITORY)
    private readonly interestRateSeederRepository: SeederRepository,
  ) {}

  public bulkCreate() {
    return this.interestRateSeederRepository.bulkCreate(interestRates);
  }
}
