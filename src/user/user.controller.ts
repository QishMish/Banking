import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TransactionModel, TransactionService } from '@app/transaction';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { GroupedResult } from '@app/common';
import { UserModel, UserService } from '@app/user';
import { AccountModel, AccountService } from '@app/account';
import { JwtAuthGuard, User } from '@app/auth';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
    private readonly accountService: AccountService,
  ) {}

  @Get('/accounts')
  @Throttle(20, 60)
  @HttpCode(HttpStatus.OK)
  public findAccounts(
    @User() { id }: UserModel,
  ): Promise<GroupedResult<AccountModel>[]> {
    return this.accountService.findGroupedUserAccounts(id);
  }

  @Get('/account/:id')
  @Throttle(20, 60)
  @HttpCode(HttpStatus.OK)
  public findOneAccount(
    @Param('id', ParseIntPipe) id: number,
    @User() { id: userId }: UserModel,
  ): Promise<AccountModel> {
    return this.accountService.findOne({
      id,
      user: {
        id: userId,
      },
    });
  }

  @Get('/transactions')
  @Throttle(20, 60)
  @HttpCode(HttpStatus.OK)
  public async findTransactions(@User() user: UserModel): Promise<UserModel> {
    const transactions = await this.transactionService.findUserTransactions(
      user.id,
    );
    return {
      ...user,
      transactions,
    };
  }

  @Get('/transaction/:id')
  @Throttle(20, 60)
  @HttpCode(HttpStatus.OK)
  public async findTransaction(
    @Param('id', ParseIntPipe) id: number,
    @User() { id: userId }: UserModel,
  ): Promise<TransactionModel> {
    return this.transactionService.findOne({
      id,
      user: {
        id: userId,
      },
    });
  }
}
