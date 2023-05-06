import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GroupedResult } from '@app/common';
import { PaginationResult } from '@app/utils';

import { AccountEntity } from '../entities';
import { AccountRepository, FindAccounts } from '../interfaces';
import { AccountTypeEnum, SavingAccountStatus, SavingAccountType } from '../types';

@Injectable()
export class AccountTypeOrmRepository implements AccountRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>
  ) {}
  public async getSavingAccounts(type: SavingAccountType): Promise<AccountEntity[]> {
    const curentDate = new Date().toISOString();
    const accounts = await this.accountRepository
      .createQueryBuilder('accounts')
      .leftJoinAndMapOne('accounts.params', 'accounts.params', 'params')
      .where('accounts."type" <= :type ', {
        type: AccountTypeEnum.SAVING_ACCOUNT
      })
      .andWhere('params.type = :paramType ', {
        paramType: type
      })
      .andWhere('params.status = :status ', {
        status: SavingAccountStatus.OPEN
      })
      .andWhere('params.nextInterestPayDate <= :curentDate', { curentDate })
      .getMany();

    return accounts;
  }

  public create(entity: unknown): Promise<AccountEntity> {
    return this.accountRepository.save(entity as AccountEntity);
  }

  public find(findManyOptions: Partial<AccountEntity>): Promise<[] | AccountEntity[]> {
    return this.accountRepository.find({
      where: findManyOptions
    });
  }

  public async findAll(options: FindAccounts): Promise<PaginationResult<AccountEntity>> {
    const { id, page, pageSize, skip, limit, ...whereOptions } = options;

    const queryBuilder = this.accountRepository.createQueryBuilder('accounts');

    if (id) {
      queryBuilder.where('accounts.id = :id', { id });
    } else {
      queryBuilder.where('1 = 1');
    }

    for (const [key, value] of Object.entries(whereOptions)) {
      if (value !== undefined) {
        queryBuilder.andWhere(`accounts.${key} = :${key}`, {
          [key]: value
        });
      }
    }

    const [accounts, count] = await queryBuilder
      .leftJoinAndMapOne('accounts.user', 'accounts.user', 'user')
      .leftJoinAndMapOne('accounts.params', 'accounts.params', 'params')
      .orderBy('accounts.createdAt', 'DESC')
      .orderBy('accounts.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      page,
      pageSize,
      total: count,
      totalPages: count,
      data: accounts
    };
  }

  public findOne(findOneOptions: Partial<AccountEntity>): Promise<AccountEntity> {
    return this.accountRepository.findOne({
      where: findOneOptions
    });
  }

  public findById(id: number): Promise<AccountEntity> {
    return this.accountRepository.findOne({
      where: {
        id
      }
    });
  }

  public findGroupedUserAccounts(userId: number): Promise<GroupedResult<AccountEntity>[]> {
    return this.accountRepository
      .createQueryBuilder('account')
      .select('account.type')
      .where('account.userId = :userId', { userId })
      .addSelect('COUNT(account.id)', 'count')
      .addSelect((subQuery) => {
        return subQuery
          .select('JSON_AGG(account2) as accounts')
          .from(AccountEntity, 'account2')
          .where('account2.type = account.type')
          .andWhere('account2.userId = :userId', { userId });
      }, 'accounts')
      .groupBy('account.type')
      .getRawMany<GroupedResult<AccountEntity>[]>();
  }

  public async updateById(id: number, entity: Partial<AccountEntity>): Promise<AccountEntity> {
    const updatedEntity = await this.findById(id);

    for (const key in entity) {
      if (key in updatedEntity) {
        updatedEntity[key] = entity[key];
      }
    }

    return this.accountRepository.save(updatedEntity);
  }

  public deleteById(id: number): Promise<boolean> {
    return this.accountRepository.delete({ id }).then((result) => !!result.affected);
  }

  public softDeleteById(id: number): Promise<boolean> {
    return this.accountRepository.softDelete({ id }).then((result) => !!result.affected);
  }
}
