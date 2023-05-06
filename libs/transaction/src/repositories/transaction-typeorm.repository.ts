import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginationResult } from '@app/utils';

import { TransactionEntity } from '../entities';
import { FindTransactions, TransactionRepository } from '../interfaces';

@Injectable()
export class TransactionTypeOrmRepository implements TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>
  ) {}

  public create(entity: unknown): Promise<TransactionEntity> {
    return this.transactionRepository.save(entity as TransactionEntity);
  }

  find(findOptions: Partial<TransactionEntity>): Promise<TransactionEntity[] | []> {
    return this.transactionRepository.find({
      where: findOptions
    });
  }

  public async findAll(options: FindTransactions): Promise<PaginationResult<TransactionEntity>> {
    const { id, page, pageSize, skip, limit, ...whereOptions } = options;

    const queryBuilder = this.transactionRepository.createQueryBuilder('transactions');

    if (id) {
      queryBuilder.where('transactions.id = :id', { id });
    } else {
      queryBuilder.where('1 = 1');
    }

    for (const [key, value] of Object.entries(whereOptions)) {
      if (value !== undefined) {
        queryBuilder.andWhere(`transactions.${key} = :${key}`, {
          [key]: value
        });
      }
    }

    const [transactions, count] = await queryBuilder
      .leftJoinAndMapOne('transactions.user', 'transactions.user', 'user')
      .leftJoinAndMapOne('transactions.sourceAcc', 'transactions.sourceAcc', 'sourceAccount')
      .leftJoinAndMapOne('transactions.destinationAcc', 'transactions.destinationAcc', 'destinationAcc')
      .orderBy('transactions.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      page,
      pageSize,
      total: count,
      totalPages: count,
      data: transactions
    };
  }

  public findById(id: number): Promise<TransactionEntity> {
    return this.transactionRepository.findOne({
      where: {
        id
      },
      loadRelationIds: true
    });
  }

  public findOne(findOneOptions: Partial<TransactionEntity>): Promise<TransactionEntity> {
    return this.transactionRepository.findOne({
      where: findOneOptions
    });
  }

  public findUserTransactions(userId: number): Promise<TransactionEntity[]> {
    return this.transactionRepository.find({
      where: {
        user: {
          id: userId
        }
      }
    });
  }

  public async updateById(id: number, entity: Partial<TransactionEntity>): Promise<TransactionEntity> {
    await this.transactionRepository.update({ id }, entity);
    return this.findById(id);
  }

  public deleteById(id: number): Promise<boolean> {
    return this.transactionRepository.delete({ id }).then((result) => !!result.affected);
  }

  public softDeleteById(id: number): Promise<boolean> {
    return this.transactionRepository.softDelete({ id }).then((result) => !!result.affected);
  }
}
