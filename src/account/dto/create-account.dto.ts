import {
  AccountTypeEnum,
  CreateAccountInput,
  SavingAccountType,
} from '@app/account';
import { AccountParams } from '@app/account';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateAccountParamsDto implements Partial<AccountParams> {
  @IsEnum(SavingAccountType)
  @IsNotEmpty()
  @ApiProperty()
  type: SavingAccountType;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  term: number;
}

class CreateAccountDto implements Omit<CreateAccountInput, 'userId'> {
  @IsEnum(AccountTypeEnum)
  @IsNotEmpty()
  @ApiProperty()
  type: AccountTypeEnum;

  @Type(() => CreateAccountParamsDto)
  @ValidateIf((x) => x.type === AccountTypeEnum.SAVING_ACCOUNT)
  @IsNotEmptyObject()
  @ValidateNested()
  @ApiProperty()
  params: CreateAccountParamsDto;
}

export { CreateAccountDto };
