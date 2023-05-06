import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

import { BaseTransaction } from '@app/common';
import { Logger } from '@app/logger';
import { TransactionEntity, TransactionStatus, TransactionType } from '@app/transaction';
import { AccountEntity, TRANFER_AMOUNT_LIMIT, UpdateBalance } from '@app/account';

import { AccountData, UserWithBalance } from '../interfaces';

@Injectable()
export class UpdateBalanceTransaction extends BaseTransaction<AccountData, UserWithBalance> {
  constructor(connection: DataSource, logger: Logger) {
    super(connection, logger);
  }

  protected async execute({ iban, userId, amount, type }: AccountData, manager: EntityManager): Promise<UserWithBalance> {
    const account = await manager.findOneOrFail(AccountEntity, {
      where: { iban, user: { id: userId } },
      relations: ['user']
    });

    const transactions = await manager.find(TransactionEntity, {
      where: {
        type: TransactionType.WITHDRAWAL,
        status: TransactionStatus.PENDING,
        destinationAcc: {
          id: account.id
        },
        user: { id: userId }
      }
    });

    const pendingTransactionAmount = transactions.reduce((prev, curr) => (prev += curr.amount), 0);

    if (type === UpdateBalance.WITHDRAWAL) {
      if (account.balance < amount) throw new BadRequestException('Insufficient funds');
      if (account.balance - pendingTransactionAmount < amount) throw new BadRequestException('Insufficient funds, pending transactions');
    }

    const incAmount = type === UpdateBalance.DEPOSIT ? amount : type === UpdateBalance.WITHDRAWAL ? -amount : null;

    const transactionStatus = this.getTransactionStatus(amount);

    const transaction = {
      amount,
      type: type === UpdateBalance.DEPOSIT ? TransactionType.DEPOSIT : TransactionType.WITHDRAWAL,
      status: transactionStatus,
      destinationAcc: account,
      user: {
        id: userId
      }
    };

    const createdTransaction = await manager.getRepository(TransactionEntity).create(transaction);

    if (transactionStatus === TransactionStatus.PENDING) {
      await manager.save(createdTransaction);
      return Promise.resolve({
        userId: account.user.id,
        balance: account.balance,
        status: TransactionStatus.PENDING
      });
    }

    account.balance = Number(account.balance) + incAmount;

    await manager.getRepository(AccountEntity).save(account);
    await manager.save(TransactionEntity, createdTransaction);

    const updatedAccount = await manager.findOne(AccountEntity, {
      where: { id: account.id, user: { id: userId } },
      relations: ['user']
    });

    return {
      userId: updatedAccount.user.id,
      balance: updatedAccount.balance,
      status: TransactionStatus.ACCEPTED
    };
  }
  private getTransactionStatus(amount: number): TransactionStatus {
    return amount > TRANFER_AMOUNT_LIMIT ? TransactionStatus.PENDING : TransactionStatus.ACCEPTED;
  }
}
