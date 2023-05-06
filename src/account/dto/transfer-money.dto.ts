import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { TransactionPurpose, TransactionType } from '@app/transaction';
import { TransferMoneyInput } from '@app/account';

class TransferMoneyDto implements Omit<TransferMoneyInput, 'userId'> {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  sourceAccountIban: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  destinationAccountIban: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  amount: number;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  @ApiProperty()
  type: TransactionType;

  @IsEnum(TransactionPurpose)
  @IsNotEmpty()
  @ApiProperty()
  purpose: TransactionPurpose;
}

export { TransferMoneyDto };
