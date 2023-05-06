import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { Role, UserModel, UserService } from '@app/user';
import { JwtAuthGuard, Roles, RolesGuard } from '@app/auth';
import { TransactionModel, TransactionService } from '@app/transaction';
import { AccountModel, AccountService } from '@app/account';
import { PaginationResult } from '@app/utils';
import { AccountTransactionService, ChangedTransactionStatus } from '@app/account-transaction';

import { FindAccountQuery, FindTransactionsQuery, FindUsersQuery } from './dtos';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class AdminController {
  constructor(
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
    private readonly accountService: AccountService,
    private readonly accountTransactionService: AccountTransactionService
  ) {}

  @Get('/user')
  @Throttle(20, 60)
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  public findUsers(@Query() query: FindUsersQuery): Promise<PaginationResult<UserModel>> {
    return this.userService.find(query);
  }

  @Get('/user/:id')
  @Throttle(20, 60)
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  public findUser(@Param('id', ParseIntPipe) id: number): Promise<UserModel> {
    return this.userService.findById(id);
  }

  @Patch('/user/:id')
  @Throttle(20, 60)
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  public deactivateUser(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.userService.activate(id);
  }

  @Patch('/user/:id/activate')
  @Throttle(20, 60)
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  public activateUser(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.userService.deactivate(id);
  }

  @Delete('/user/:id/suspend')
  @Throttle(20, 60)
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  public deleteUser(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.userService.deleteById(id);
  }

  @Get('/accounts')
  @Throttle(20, 60)
  @HttpCode(HttpStatus.OK)
  public findAccounts(@Query() query: FindAccountQuery): Promise<PaginationResult<AccountModel>> {
    return this.accountService.find(query);
  }

  @Get('/account/:id')
  @Throttle(20, 60)
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  public findOneAccount(@Param('id', ParseIntPipe) id: number): Promise<AccountModel> {
    return this.accountService.findById(id);
  }

  @Get('/transactions')
  @Throttle(20, 60)
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  public async findTransactions(@Query() findTransactionsQuery: FindTransactionsQuery): Promise<PaginationResult<TransactionModel>> {
    return this.transactionService.find(findTransactionsQuery);
  }

  @Get('/transaction/:id')
  @Throttle(20, 60)
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  public async findTransaction(@Param('id', ParseIntPipe) id: number): Promise<TransactionModel> {
    return this.transactionService.findById(id);
  }

  @Patch('transaction/:id/accept')
  @Throttle(10, 60)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  public accept(@Param('id', new ParseIntPipe()) id: number): Promise<ChangedTransactionStatus> {
    return this.accountTransactionService.accept(id);
  }

  @Patch('transaction/:id/decline')
  @Throttle(10, 60)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  public decline(@Param('id', new ParseIntPipe()) id: number): Promise<ChangedTransactionStatus> {
    return this.accountTransactionService.decline(id);
  }
}
