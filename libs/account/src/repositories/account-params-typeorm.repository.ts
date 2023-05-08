import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AccountParamsRepository } from '../interfaces';
import { AccountParamsEntity } from '../entities';

@Injectable()
export class AccountParamsTypeOrmRepository implements AccountParamsRepository {
  constructor(
    @InjectRepository(AccountParamsEntity)
    private readonly accountParamsRepository: Repository<AccountParamsEntity>
  ) {}

  public create(entity: unknown): Promise<AccountParamsEntity> {
    return this.accountParamsRepository.save(entity as AccountParamsEntity);
  }

  public find(findManyOptions: Partial<AccountParamsEntity>): Promise<[] | AccountParamsEntity[]> {
    return this.accountParamsRepository.find({
      where: findManyOptions
    });
  }

  public findById(id: number): Promise<AccountParamsEntity> {
    return this.accountParamsRepository.findOne({
      where: {
        id
      }
    });
  }

  public findOne(findOptions: Partial<AccountParamsEntity>): Promise<AccountParamsEntity> {
    return this.accountParamsRepository.findOne({
      where: findOptions
    });
  }

  public async updateById(id: number, entity: Partial<AccountParamsEntity>): Promise<AccountParamsEntity> {
    await this.accountParamsRepository.update({ id }, entity);
    return this.findById(id);
  }

  public deleteById(id: number): Promise<boolean> {
    return this.accountParamsRepository.delete({ id }).then((result) => !!result.affected);
  }

  public softDeleteById(id: number): Promise<boolean> {
    return this.accountParamsRepository.softDelete({ id }).then((result) => !!result.affected);
  }
}
