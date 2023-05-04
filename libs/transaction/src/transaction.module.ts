import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from '@app/utils';
import { TransactionService } from './services';
import { TransactionEntity } from './entities';
import { TRANSACTION_REPOSITORY } from './constants';
import { TransactionTypeOrmRepository } from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity]), UtilsModule],
  providers: [
    TransactionService,
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TransactionTypeOrmRepository,
    },
  ],
  exports: [TransactionService, TRANSACTION_REPOSITORY],
})
export class TransactionLibModule {}
