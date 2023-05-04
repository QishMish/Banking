import { Inject, Injectable } from '@nestjs/common';
import { PaginationService, builder } from '@app/utils';
import { PaginationResult } from '@app/utils';
import { TransactionStatus } from '../types';
import { Transaction, TransactionModel } from '../interfaces';
import { FindTransactions, TransactionRepository } from '../interfaces';
import { TRANSACTION_REPOSITORY } from '../constants';
import { DeepPartial } from '@app/common';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
    private readonly paginationService: PaginationService,
  ) {}

  public create(transaction: Transaction): Promise<Transaction> {
    return this.transactionRepository.create(transaction);
  }

  public find(
    options: FindTransactions,
  ): Promise<PaginationResult<TransactionModel>> {
    const {
      id,
      page = 1,
      pageSize = 15,
      status,
      type,
      userId,
      destinationAccId,
      sourceAccId,
    } = options;

    const { skip, limit } = this.paginationService.getPaginationProps({
      page,
      pageSize,
    });
    const findOptions = builder<FindTransactions>(options)
      .id(id)
      .status(status)
      .userId(userId)
      .type(type)
      .destinationAccId(destinationAccId)
      .sourceAccId(sourceAccId)
      .skip(skip)
      .limit(limit)
      .build();

    return this.transactionRepository.findAll(findOptions);
  }

  public findOne(
    options: DeepPartial<TransactionModel>,
  ): Promise<TransactionModel | undefined> {
    return this.transactionRepository.findOne(options);
  }

  public findById(id: number): Promise<TransactionModel | undefined> {
    return this.transactionRepository.findById(id);
  }

  public findUserTransactions(userId: number): Promise<TransactionModel[]> {
    return this.transactionRepository.findUserTransactions(userId);
  }

  public updateById(
    id: number,
    transaction: Partial<TransactionModel>,
  ): Promise<TransactionModel> {
    return this.transactionRepository.updateById(id, transaction);
  }

  public accept(id: number): Promise<TransactionModel> {
    return this.transactionRepository.updateById(id, {
      status: TransactionStatus.ACCEPTED,
    });
  }

  public decline(id: number): Promise<TransactionModel> {
    return this.transactionRepository.updateById(id, {
      status: TransactionStatus.PENDING,
    });
  }

  public deleteById(id: number): Promise<boolean> {
    return this.transactionRepository.deleteById(id);
  }
}
