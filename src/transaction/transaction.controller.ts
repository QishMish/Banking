import { TransactionModel, TransactionService } from '@app/transaction';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FindTransactionsQuery } from './dto';
import { JwtAuthGuard, Roles, RolesGuard, User } from '@app/auth';
import { Role, UserModel } from '@app/user';
import { Throttle } from '@nestjs/throttler';
import { PaginationResult } from '@app/utils/types';

@ApiTags('Transaction')
@ApiBearerAuth()
@Controller('transaction')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/')
  @Throttle(10, 60)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  public findAll(
    @User() { id }: UserModel,
    @Query() findTransactionsQuery: FindTransactionsQuery,
  ): Promise<PaginationResult<TransactionModel>> {
    return this.transactionService.find({
      ...findTransactionsQuery,
      userId: id,
    });
  }

  @Get('/:id')
  @Throttle(10, 60)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  public findOne(
    @User() { id: userId }: UserModel,
    @Query('id') id: number,
  ): Promise<TransactionModel | never> {
    return this.transactionService.findOne({ id, user: { id: userId } });
  }
}
