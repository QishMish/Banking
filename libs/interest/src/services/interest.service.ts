import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { INTEREST_REPOSITORY } from '../constants';
import { Interest, InterestRepository } from '../interfaces';
import { InterestEntity } from '../entities';
import { FindOptions } from '@app/common';

@Injectable()
export class InterestService {
  constructor(
    @Inject(INTEREST_REPOSITORY)
    private readonly interestRepository: InterestRepository,
  ) {}

  public create(user: Interest): Promise<InterestEntity> {
    return this.interestRepository.create(user);
  }

  public find(
    findOptions?: Partial<InterestEntity>,
  ): Promise<InterestEntity[] | []> {
    return this.interestRepository.find(findOptions);
  }

  public async findById(id: number): Promise<InterestEntity | never> {
    const user = await this.interestRepository.findById(id);

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  public async findOne(
    findOptions: FindOptions<InterestEntity>,
  ): Promise<InterestEntity | never> {
    const user = await this.interestRepository.findOne(findOptions);

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  public getInterestRate(amount: number, month: number): Promise<number> {
    return this.interestRepository.getInterestRate(amount, month);
  }

  public updateById(
    id: number,
    user: Partial<InterestEntity>,
  ): Promise<InterestEntity> {
    return this.interestRepository.updateById(id, user);
  }

  public deleteById(id: number): Promise<boolean> {
    return this.interestRepository.softDeleteById(id);
  }
}
