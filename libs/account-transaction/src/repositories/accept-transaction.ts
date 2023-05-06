import { DataSource, EntityManager } from 'typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { AccountEntity } from '@app/account';
import { BaseTransaction } from '@app/common';
import { Logger } from '@app/logger';

import { ChangeTransactionStatusData, ChangedTransactionStatus } from '../interfaces';
import { TransactionEntity, TransactionModel, TransactionStatus, TransactionType } from '@app/transaction';

@Injectable()
export class AcceptTransaction extends BaseTransaction<ChangeTransactionStatusData, ChangedTransactionStatus> {
  constructor(connection: DataSource, logger: Logger) {
    super(connection, logger);
  }

  protected async execute({ id }: ChangeTransactionStatusData, manager: EntityManager): Promise<ChangedTransactionStatus> {
    const transaction = await manager.findOneOrFail(TransactionEntity, {
      where: { id, status: TransactionStatus.PENDING },
      loadRelationIds: true,
      loadEagerRelations: true
    });

    if (transaction.type === TransactionType.TRANSFER) {
      return this.acceptTransfer(transaction, manager);
    }
    const destinationAccount = await manager.findOneByOrFail(AccountEntity, {
      id: transaction.destinationAcc.id
    });

    switch (transaction.type) {
      case TransactionType.WITHDRAWAL:
        destinationAccount.balance = Number(destinationAccount.balance) - transaction.amount;
        break;
      case TransactionType.DEPOSIT:
        destinationAccount.balance = Number(destinationAccount.balance) + transaction.amount;
        break;

      default:
        throw new InternalServerErrorException('Invalid transaction type');
    }
    transaction.status = TransactionStatus.ACCEPTED;

    await manager.save(AccountEntity, destinationAccount);
    await manager.save(TransactionEntity, transaction);

    return {
      status: TransactionStatus.ACCEPTED
    };
  }

  private async acceptTransfer(transaction: TransactionModel, manager: EntityManager) {
    const sourceAccount = await manager.findOneByOrFail(AccountEntity, {
      id: transaction.sourceAcc as any
    });
    const destinationAccount = await manager.findOneByOrFail(AccountEntity, {
      id: transaction.destinationAcc as any
    });

    destinationAccount.balance = Number(destinationAccount.balance) + transaction.amount;
    sourceAccount.balance = Number(sourceAccount.balance) - transaction.amount;
    transaction.status = TransactionStatus.ACCEPTED;

    await manager.save(AccountEntity, destinationAccount);
    await manager.save(AccountEntity, sourceAccount);
    await manager.save(TransactionEntity, transaction);

    return {
      status: TransactionStatus.ACCEPTED
    };
  }
}
