import { Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UpdateEvent } from 'typeorm/subscriber/event/UpdateEvent';
import { EntitySubscriberInterface } from 'typeorm/subscriber/EntitySubscriberInterface';
import { Action } from '@app/common';
import { Logger } from '@app/logger';
import { AccountEntity } from '../entities';
import { ACCOUNT_HISTORY_REPOSITORY } from '../constants';
import { AccountHistoryRepository } from '../interfaces';

@Injectable()
export class AccountSubscriber
  implements EntitySubscriberInterface<AccountEntity>
{
  private account: AccountEntity;

  constructor(
    @Inject(ACCOUNT_HISTORY_REPOSITORY)
    private readonly accountHistoryRepository: AccountHistoryRepository,
    @InjectDataSource() readonly dataSource: DataSource,
    private readonly logger: Logger,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return AccountEntity;
  }

  afterLoad(entity: AccountEntity): void | Promise<AccountEntity> {
    this.account = entity;
  }

  afterUpdate(
    event: UpdateEvent<AccountEntity>,
  ): void | Promise<AccountEntity> {
    try {
      const { status, balance } = event.entity;

      const balanceUpdated = event.updatedColumns.find(
        (value) => value.propertyName === 'balance',
      );
      const statusUpdated = event.updatedColumns.find(
        (value) => value.propertyName === 'status',
      );

      if (balanceUpdated || statusUpdated) {
        this.accountHistoryRepository.create({
          balance: balanceUpdated ? balance : this.account.balance,
          status: statusUpdated ? status : this.account.status,
          account: this.account,
          type: Action.UPDATED,
        });
      }
    } catch (error) {
      this.logger.error(`Cannot update history table for accounts`, error);
    }
  }
}
