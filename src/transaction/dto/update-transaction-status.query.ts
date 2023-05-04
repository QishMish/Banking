import { TransactionStatus } from '@app/transaction';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpdateTransactionStatusDto {
  @IsEnum(TransactionStatus)
  @IsOptional()
  @ApiProperty({ required: true })
  status: TransactionStatus;
}

export { UpdateTransactionStatusDto };
