import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { Logger } from '@app/logger';

@Injectable()
export abstract class BaseTransaction<TransactionInput, TransactionOutput> {
  protected constructor(private readonly connection: DataSource, private readonly logger?: Logger) {}

  protected abstract execute(data: TransactionInput, manager: EntityManager): Promise<TransactionOutput>;

  private async createRunner(): Promise<QueryRunner> {
    return this.connection.createQueryRunner();
  }

  public async run(data: TransactionInput): Promise<TransactionOutput> {
    const queryRunner = await this.createRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      for await (const [key, value] of Object.entries(data)) {
      }
      const result = await this.execute(data, queryRunner.manager);

      await queryRunner.commitTransaction();
      this.logger.log(`Transaction succeed.`);
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error(`Transaction failed: ${error}`);
      throw new InternalServerErrorException('Transaction failed', error?.response?.message || error);
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }

  public async runWithinTransaction(data: TransactionInput, manager: EntityManager): Promise<TransactionOutput> {
    return this.execute(data, manager);
  }
}
