import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatuses } from '@app/user';

class UpdateUserStatusDto {
  @IsEnum(UserStatuses)
  @IsOptional()
  @ApiProperty({ required: true })
  status: UserStatuses;
}

export { UpdateUserStatusDto };
