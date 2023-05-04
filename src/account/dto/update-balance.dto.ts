import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpdateBalanceDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  amount: number;
}

export { UpdateBalanceDto };
