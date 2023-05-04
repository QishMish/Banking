import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  TransactionStatus,
  TransactionType,
} from '../../transaction/src/types';
import { TransactionModel } from '../../transaction/src/interfaces';
import { TransactionRepository } from '../../transaction/src/interfaces';
import { TRANSACTION_REPOSITORY } from '../../transaction/src/constants';
import { AccountService, UpdateBalance } from '@app/account';
import { DbTransactionService } from '@app/common';
import { Logger } from '@app/logger';

@Injectable()
export class AccountTransactionService {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
    private readonly accountService: AccountService,
    private readonly dbTransactionService: DbTransactionService,
    private readonly logger: Logger,
  ) {}
  public async accept(id: number): Promise<TransactionModel> {
    try {
      const transaction = await this.transactionRepository.findById(id);

      if (!transaction) throw new NotFoundException('Transaction not found');

      const account = await this.accountService.findById(
        transaction.destinationAcc.id,
      );

      if (!account) throw new NotFoundException('Account not found');

      const type =
        transaction.type === TransactionType.WITHDRAWAL
          ? UpdateBalance.WITHDRAWAL
          : UpdateBalance.DEPOSIT;
      await this.dbTransactionService.executeTransaction(async () => {
        await this.accountService.applyTransaction(
          account.id,
          type,
          transaction.amount,
        );
        await this.updateTransactionStatus(id, TransactionStatus.ACCEPTED);
      });
      return this.transactionRepository.findById(id);
    } catch (error) {
      this.logger.error('Transaction declined');
      await this.updateTransactionStatus(id, TransactionStatus.DECLINED);
    }
  }

  public async reject(id: number): Promise<TransactionModel> {
    try {
      const transaction = await this.transactionRepository.findById(id);

      if (!transaction) throw new NotFoundException('Transaction not found');

      const account = await this.accountService.findById(
        transaction.destinationAcc.id,
      );

      if (!account) throw new NotFoundException('Account not found');

      await this.updateTransactionStatus(id, TransactionStatus.DECLINED);
      return this.transactionRepository.findById(id);
    } catch (error) {
      this.logger.error('Transaction declined');
      await this.updateTransactionStatus(id, TransactionStatus.DECLINED);
    }
  }

  private async updateTransactionStatus(
    id: number,
    status: TransactionStatus,
  ): Promise<void> {
    await this.transactionRepository.updateById(id, { status });
  }
}
