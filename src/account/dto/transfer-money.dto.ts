import { TransferMoneyInput } from '@app/account';
import { TransactionPurpose, TransactionType } from '@app/transaction';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
