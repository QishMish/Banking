import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AccountHistoryEntity } from '../entities';
import { AccountHistoryRepository } from '../interfaces';

@Injectable()
export class AcountHistoryTypeormRepository implements AccountHistoryRepository {
  constructor(
    @InjectRepository(AccountHistoryEntity)
    private readonly accountHistory: Repository<AccountHistoryEntity>
  ) {}

  public async create(entity: unknown): Promise<AccountHistoryEntity> {
    const accountHistory = await this.accountHistory.create(entity);
    return this.accountHistory.save(accountHistory);
  }
}
