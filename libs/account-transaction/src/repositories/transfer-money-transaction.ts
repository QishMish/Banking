import { AccountEntity, TRANFER_AMOUNT_LIMIT } from '@app/account';
import { BaseTransaction } from '@app/common';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

import { Logger } from '@app/logger';
import { TransactionEntity, TransactionStatus, TransactionType } from '@app/transaction';

import { TransferData, TransferedMoney } from '../interfaces';

@Injectable()
export class TransferMoneyTransaction extends BaseTransaction<TransferData, TransferedMoney> {
  constructor(connection: DataSource, logger: Logger) {
    super(connection, logger);
  }

  protected async execute(
    { userId, amount, sourceAccountIban, destinationAccountIban }: TransferData,
    manager: EntityManager
  ): Promise<TransferedMoney> {
    const [sourceAccount, destinationAccount, transactions] = await Promise.all([
      manager.findOneOrFail(AccountEntity, {
        where: { iban: sourceAccountIban, user: { id: userId } }
      }),
      manager.findOneOrFail(AccountEntity, {
        where: { iban: destinationAccountIban }
      }),
      manager.find(TransactionEntity, {
        where: {
          type: TransactionType.TRANSFER,
          status: TransactionStatus.PENDING,
          sourceAcc: {
            iban: sourceAccountIban
          },
          user: { id: userId }
        }
      })
    ]);

    const pendingTransactionAmount = transactions.reduce((prev, curr) => (prev += curr.amount), 0);

    if (sourceAccount.balance < amount) throw new BadRequestException('Insufficient funds');
    if (sourceAccount.balance - pendingTransactionAmount < amount)
      throw new BadRequestException('Insufficient funds, pending transactions');

    const transactionStatus = this.getTransactionStatus(amount);

    const transaction = {
      amount,
      destinationAcc: destinationAccount,
      sourceAcc: sourceAccount,
      type: TransactionType.TRANSFER,
      user: {
        id: userId
      },
      status: transactionStatus
    };

    const createdTransaction = await manager.getRepository(TransactionEntity).create(transaction);

    if (transactionStatus === TransactionStatus.PENDING) {
      await manager.save(createdTransaction);
      return Promise.resolve({
        userId,
        destinationAccIban: destinationAccountIban,
        amount,
        status: transactionStatus
      });
    }

    await Promise.all([
      manager.getRepository(AccountEntity).decrement({ id: sourceAccount.id }, 'balance', amount),
      manager.getRepository(AccountEntity).increment({ id: destinationAccount.id }, 'balance', amount)
    ]);

    await manager.save(TransactionEntity, createdTransaction);

    const updatedAccount = await manager.findOne(AccountEntity, {
      where: { id: destinationAccount.id, user: { id: userId } },
      relations: ['user']
    });

    return {
      userId: updatedAccount.user.id,
      destinationAccIban: destinationAccountIban,
      amount,
      status: transactionStatus
    };
  }
  private getTransactionStatus(amount: number): TransactionStatus {
    return amount > TRANFER_AMOUNT_LIMIT ? TransactionStatus.PENDING : TransactionStatus.ACCEPTED;
  }
}
