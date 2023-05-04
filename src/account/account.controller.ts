import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  AccountModel,
  AccountService,
  AccountTypeEnum,
  UpdateBalance,
} from '@app/account';
import { CreateAccountDto } from './dto';
import { JwtAuthGuard, Roles, RolesGuard, User } from '@app/auth';
import { Role, UserModel } from '@app/user';
import { TransferMoneyDto, FindAccountQuery } from './dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PaginationResult } from '@app/utils/types';

@ApiBearerAuth()
@ApiTags('Account')
@Controller('account')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  public create(
    @User() { id }: UserModel,
    @Body() account: CreateAccountDto,
  ): Promise<AccountModel[] | AccountModel | never> {
    switch (account.type) {
      case AccountTypeEnum.CHECKING_ACCOUNT:
        return this.accountService.createUserAccount({
          ...account,
          userId: id,
        });
      case AccountTypeEnum.SAVING_ACCOUNT:
        return this.accountService.createSavingAccount({
          ...account,
          userId: id,
        });
      default:
        throw new BadRequestException('Invalid account type');
    }
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  public find(
    @User() { id }: UserModel,
    @Query() query: FindAccountQuery,
  ): Promise<PaginationResult<AccountModel>> {
    return this.accountService.find({ ...query, userId: id });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  public findOne(
    @User() { id: userId }: UserModel,
    @Param('id') id: number,
  ): Promise<AccountModel | undefined> {
    return this.accountService.findOne({ id, user: { id: userId } });
  }

  @Delete('/:iban')
  @HttpCode(HttpStatus.ACCEPTED)
  public delete(
    @User() { id: userId }: UserModel,
    @Param('iban') iban: string,
  ): Promise<boolean> {
    return this.accountService.deleteAccount(iban, userId);
  }

  @Put('/:iban/deposit')
  @HttpCode(HttpStatus.OK)
  public depositAccount(
    @User() { id }: UserModel,
    @Param('iban') iban: string,
    @Body() { amount }: UpdateBalanceDto,
  ): Promise<boolean> {
    return this.accountService.updateBalance(
      id,
      iban,
      amount,
      UpdateBalance.DEPOSIT,
    );
  }

  @Put('/:iban/withdraw')
  @HttpCode(HttpStatus.OK)
  public withdrawAccount(
    @User() { id }: UserModel,
    @Param('iban') iban: string,
    @Body() { amount }: UpdateBalanceDto,
  ): Promise<boolean> {
    return this.accountService.updateBalance(
      id,
      iban,
      amount,
      UpdateBalance.WITHDRAWAL,
    );
  }

  @Patch('/transfer')
  @HttpCode(HttpStatus.OK)
  public transfer(
    @User() { id }: UserModel,
    @Body() transferMoney: TransferMoneyDto,
  ): Promise<boolean> {
    return this.accountService.transferMoney({ ...transferMoney, userId: id });
  }
}
