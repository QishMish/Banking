import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNumber, IsOptional } from "class-validator";

import { BasePaginationDto } from "@app/common";
import { TransactionStatus } from "@app/transaction";
import { FindUsers, Role, UserStatuses } from "@app/user";


class FindUsersQuery extends BasePaginationDto implements FindUsers {
  @ApiProperty({ required: false })
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  id: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsEnum(TransactionStatus)
  @IsOptional()
  @ApiProperty({ required: false })
  status: UserStatuses;

  @IsEnum(Role)
  @IsOptional()
  @ApiProperty({ required: false })
  role: Role;
}

export { FindUsersQuery };
