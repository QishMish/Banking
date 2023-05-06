import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

import { TransactionEntity, TransactionModel, TransactionStatus, TransactionType } from '@app/transaction';
import { BaseTransaction } from '@app/common';
import { Logger } from '@app/logger';

import { ChangeTransactionStatusData, ChangedTransactionStatus } from '../interfaces';

@Injectable()
export class DeclineTransaction extends BaseTransaction<ChangeTransactionStatusData, ChangedTransactionStatus> {
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
      return this.declineTransfer(transaction, manager);
    }

    transaction.status = TransactionStatus.DECLINED;
    await manager.save(TransactionEntity, transaction);

    return {
      status: TransactionStatus.DECLINED
    };
  }

  private async declineTransfer(transaction: TransactionModel, manager: EntityManager) {
    transaction.status = TransactionStatus.DECLINED;
    await manager.save(TransactionEntity, transaction);
    return {
      status: TransactionStatus.DECLINED
    };
  }
}
