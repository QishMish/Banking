import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { BasePaginationDto } from '@app/common';
import { TransactionType, TransactionStatus, FindTransactions } from '@app/transaction';

class FindTransactionsQuery extends BasePaginationDto implements FindTransactions {
  @ApiProperty({ required: false })
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  id: number;

  @IsEnum(TransactionStatus)
  @IsOptional()
  @ApiProperty({ required: false })
  status: TransactionStatus;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  @Transform(({ value }) => parseInt(value))
  userId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  @Transform(({ value }) => parseInt(value))
  sourceAccId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  @Transform(({ value }) => parseInt(value))
  destinationAccId: number;

  @IsEnum(TransactionType)
  @IsOptional()
  @ApiProperty({ required: false })
  type: TransactionType;
}

export { FindTransactionsQuery };
