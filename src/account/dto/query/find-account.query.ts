import { BasePaginationDto } from '@app/common';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { AccountStatus, AccountTypeEnum, FindAccounts } from '@app/account';

class FindAccountQuery extends BasePaginationDto implements FindAccounts {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({ required: false })
  id?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  iban: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  userId: number;

  @IsEnum(AccountStatus)
  @IsOptional()
  @ApiProperty({ required: false })
  status: AccountStatus;

  @IsEnum(AccountTypeEnum)
  @IsOptional()
  @ApiProperty({ required: false })
  type: AccountTypeEnum;
}

export { FindAccountQuery };
