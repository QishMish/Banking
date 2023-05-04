import { BaseRepository } from '@app/common';
import { InterestEntity } from '../entities';

interface InterestRepositoryExtension {
  getInterestRate(amount: number, month: number): Promise<number>;
}

type InterestRepository = BaseRepository<InterestEntity> &
  InterestRepositoryExtension;

export { InterestRepository };
