import { PaginationProps } from '@app/utils/types';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class BasePaginationDto implements PaginationProps {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({ required: false })
  @IsNumber()
  page: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({ required: false })
  @IsNumber()
  pageSize: number;
}
