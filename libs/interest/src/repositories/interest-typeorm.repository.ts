import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { InterestModel, InterestRepository } from '../interfaces';
import { InterestEntity } from '../entities';

@Injectable()
export class InterestTypeOrmRepository implements InterestRepository {
  constructor(
    @InjectRepository(InterestEntity)
    private readonly interestRepository: Repository<InterestEntity>,
  ) {}

  public create(entity: unknown): Promise<InterestEntity> {
    return this.interestRepository.save(entity as InterestEntity);
  }

  public async bulkCreate(
    entities: InterestModel[],
  ): Promise<InterestEntity[]> {
    const ids = entities.map((entity) => entity.id);
    const existingEntities = await this.interestRepository.find({
      where: {
        id: In(ids),
      },
    });

    const newEntities = entities.filter((entity) => {
      return !existingEntities.some((existingEntity) => {
        return existingEntity.id === entity.id;
      });
    });

    const savedEntities = await Promise.all(
      newEntities.map(async (entity) => {
        const newEntity = this.interestRepository.create(entity);
        return await this.interestRepository.save(newEntity);
      }),
    );

    return savedEntities;
  }

  public find(
    findManyOptions: Partial<InterestEntity>,
  ): Promise<[] | InterestEntity[]> {
    return this.interestRepository.find({
      where: findManyOptions,
    });
  }

  public findById(id: number): Promise<InterestEntity> {
    return this.interestRepository.findOne({
      where: { id },
    });
  }

  public findOne(
    findOptions: Partial<InterestEntity>,
  ): Promise<InterestEntity> {
    return this.interestRepository.findOne({
      where: findOptions,
    });
  }

  public async getInterestRate(amount: number, month: number): Promise<number> {
    const interest = await this.interestRepository.findOne({
      where: {
        minAmount: LessThanOrEqual(amount),
        maxAmount: MoreThanOrEqual(amount),
        minMonth: LessThanOrEqual(month),
        maxMonth: MoreThanOrEqual(month),
      },
      order: {
        rate: 'DESC',
      },
    });

    if (!interest) {
      throw new InternalServerErrorException(
        'Interest rate not found for the given amount and month.',
      );
    }

    return interest.rate;
  }

  public async updateById(
    id: number,
    entity: Partial<InterestEntity>,
  ): Promise<InterestEntity> {
    await this.interestRepository.update({ id }, entity);
    return this.findById(id);
  }

  public deleteById(id: number): Promise<boolean> {
    return this.interestRepository
      .delete({ id })
      .then((result) => !!result.affected);
  }

  public softDeleteById(id: number): Promise<boolean> {
    return this.interestRepository
      .softDelete({ id })
      .then((result) => !!result.affected);
  }
}
