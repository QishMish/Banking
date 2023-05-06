import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { PaginationService, builder, PaginationResult } from '@app/utils';
import { DeepPartial, GroupedResult } from '@app/common';
import { Logger } from '@app/logger';
import { INTEREST_REPOSITORY, InterestRepository } from '@app/interest';

import { AccountModel, AccountParamsRepository, AccountRepository, CreateAccountInput, FindAccounts } from '../interfaces';
import { SavingAccountType } from '../types';
import { ACCOUNT_PARAMS_REPOSITORY, ACCOUNT_REPOSITORY } from '../constants/tokens';

@Injectable()
export class AccountService {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
    @Inject(ACCOUNT_PARAMS_REPOSITORY)
    private readonly accountParamsRepository: AccountParamsRepository,
    @Inject(INTEREST_REPOSITORY)
    private readonly interestRepository: InterestRepository,
    private readonly paginationService: PaginationService,
    private readonly logger: Logger
  ) {}

  public find(options: FindAccounts): Promise<PaginationResult<AccountModel>> {
    const { id, iban, page = 1, pageSize = 15, status, type, userId } = options;
    const { skip, limit } = this.paginationService.getPaginationProps({
      page,
      pageSize
    });
    const findOptions = builder<FindAccounts>(options)
      .id(id)
      .userId(userId)
      .status(status)
      .type(type)
      .iban(iban)
      .skip(skip)
      .limit(limit)
      .build();

    return this.accountRepository.findAll(findOptions);
  }

  public findGroupedUserAccounts(userId: number): Promise<GroupedResult<AccountModel>[]> {
    return this.accountRepository.findGroupedUserAccounts(userId);
  }

  public findOne(option: DeepPartial<AccountModel>): Promise<AccountModel> {
    return this.accountRepository.findOne(option);
  }

  public findById(id: number): Promise<AccountModel> {
    return this.accountRepository.findById(id);
  }

  public async softDeleteById(id: number): Promise<boolean> {
    return this.accountRepository.softDeleteById(id);
  }

  public createUserAccount({ userId, type }: CreateAccountInput): Promise<AccountModel> {
    return this.accountRepository.create({
      iban: uuidv4(),
      balance: 0,
      type,
      user: {
        id: userId
      }
    });
  }

  public async createSavingAccount({
    userId,
    type,
    params: { type: accountType, amount, term }
  }: CreateAccountInput): Promise<AccountModel> {
    const interestPayDateMap = new Map<SavingAccountType, () => Date>([
      [SavingAccountType.TERM_DEPOSIT, () => this.calculateInterestPayDates().nextInterestPayDate],
      [SavingAccountType.FIXED_DEPOSIT, () => this.calculateInterestPayDates(term).nextInterestPayDate]
    ]);
    const nextInterestPayDate = interestPayDateMap.get(accountType)?.();

    if (!nextInterestPayDate) {
      throw new InternalServerErrorException('Invalid saving account type');
    }

    try {
      const interestRate = await this.interestRepository.getInterestRate(amount, term);
      const accountParams = await this.accountParamsRepository.create({
        term,
        amount,
        type: accountType,
        interestRate: Number(interestRate),
        nextInterestPayDate
      });

      const account = await this.accountRepository.create({
        iban: uuidv4(),
        type,
        balance: amount,
        user: {
          id: userId
        },
        params: accountParams
      });
      this.logger.error(`Saving account created`);
      return account;
    } catch (err) {
      this.logger.error(`Error during saving account creation`, err);
      throw new InternalServerErrorException(err.message);
    }
  }

  public async getSavingAccounts(type: SavingAccountType): Promise<AccountModel[]> {
    return this.accountRepository.getSavingAccounts(type);
  }

  public async update(id: number, account: Partial<AccountModel>): Promise<AccountModel> {
    return this.accountRepository.updateById(id, account);
  }

  public async deleteAccount(iban, userId): Promise<boolean> {
    const account = await this.accountRepository.findOne({
      iban,
      user: { id: userId }
    });
    if (!account) throw new NotFoundException();
    return this.accountRepository.softDeleteById(account.id);
  }

  private calculateInterestPayDates(month = 1): {
    lastInterestPayDate: Date;
    nextInterestPayDate: Date;
  } {
    const currentDate = new Date();
    const nextPaymentDate = currentDate.setMonth(currentDate.getMonth() + month);

    return {
      lastInterestPayDate: new Date(),
      nextInterestPayDate: new Date(nextPaymentDate)
    };
  }
}
