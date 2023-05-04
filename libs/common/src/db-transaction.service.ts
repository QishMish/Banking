import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DbTransactionServiceInterface } from './interfaces';

@Injectable()
export class DbTransactionService implements DbTransactionServiceInterface {
  constructor(private dataSource: DataSource) {}

  async executeTransaction<T>(
    callback: (entityManager) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await callback(queryRunner.manager);

      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
