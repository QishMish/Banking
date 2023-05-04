import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { DbTransactionService } from './db-transaction.service';

@Module({
  providers: [CommonService, DbTransactionService],
  exports: [CommonService, DbTransactionService],
})
export class CommonModule {}
