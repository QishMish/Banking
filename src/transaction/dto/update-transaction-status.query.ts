import { IsEnum, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

import { TransactionStatus } from "@app/transaction";

class UpdateTransactionStatusDto {
  @IsEnum(TransactionStatus)
  @IsOptional()
  @ApiProperty({ required: true })
  status: TransactionStatus;
}

export { UpdateTransactionStatusDto };
