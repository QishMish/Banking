import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  TRANSACTION_REPOSITORY,
  TransactionRepository,
  TransactionStatus,
} from '@app/transaction';
import { PaginationResult } from '@app/utils/types';
import { PaginationService, builder } from '@app/utils';
import { DbTransactionService, DeepPartial, GroupedResult } from '@app/common';
import {
  AccountModel,
  AccountParamsRepository,
  AccountRepository,
  Command,
  CreateAccountInput,
  FindAccounts,
  TransferMoneyInput,
} from '../interfaces';
import { SavingAccountType, UpdateBalance } from '../types';
import { WithdrawCommand, DepositCommand } from '../commands';
import { AccountEntity } from '../entities';
import {
  ACCOUNT_PARAMS_REPOSITORY,
  ACCOUNT_REPOSITORY,
} from '../constants/tokens';
import { TRANFER_AMOUNT_LIMIT } from '../constants';
import { INTEREST_REPOSITORY, InterestRepository } from '@app/interest';
import { Logger } from '@app/logger';

@Injectable()
export class AccountService {
  constructor(
    private readonly dbTransactionService: DbTransactionService,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
    @Inject(ACCOUNT_PARAMS_REPOSITORY)
    private readonly accountParamsRepository: AccountParamsRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
    @Inject(INTEREST_REPOSITORY)
    private readonly interestRepository: InterestRepository,
    private readonly paginationService: PaginationService,
    private readonly logger: Logger,
  ) {}

  private execute(command: Command): Promise<boolean> {
    return command.execute();
  }

  public find(options: FindAccounts): Promise<PaginationResult<AccountModel>> {
    const { id, iban, page = 1, pageSize = 15, status, type, userId } = options;
    const { skip, limit } = this.paginationService.getPaginationProps({
      page,
      pageSize,
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

  public findGroupedUserAccounts(
    userId: number,
  ): Promise<GroupedResult<AccountModel>[]> {
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

  public createUserAccount({
    userId,
    type,
  }: CreateAccountInput): Promise<AccountModel> {
    return this.accountRepository.create({
      iban: uuidv4(),
      balance: 0,
      type,
      user: {
        id: userId,
      },
    });
  }

  public async createSavingAccount({
    userId,
    type,
    params: { type: accountType, amount, term },
  }: CreateAccountInput): Promise<AccountModel> {
    const interestPayDateMap = new Map<SavingAccountType, () => Date>([
      [
        SavingAccountType.TERM_DEPOSIT,
        () => this.calculateInterestPayDates().nextInterestPayDate,
      ],
      [
        SavingAccountType.FIXED_DEPOSIT,
        () => this.calculateInterestPayDates(term).nextInterestPayDate,
      ],
    ]);
    const nextInterestPayDate = interestPayDateMap.get(accountType)?.();

    if (!nextInterestPayDate) {
      throw new InternalServerErrorException('Invalid saving account type');
    }

    try {
      const interestRate = await this.interestRepository.getInterestRate(
        amount,
        term,
      );
      const accountParams = await this.accountParamsRepository.create({
        term,
        amount,
        type: accountType,
        interestRate: Number(interestRate),
        nextInterestPayDate,
      });

      const account = await this.accountRepository.create({
        iban: uuidv4(),
        type,
        balance: amount,
        user: {
          id: userId,
        },
        params: accountParams,
      });
      this.logger.error(`Saving account created`);
      return account;
    } catch (err) {
      this.logger.error(`Error during saving account creation`, err);
      throw new InternalServerErrorException(err.message);
    }
  }

  public async updateBalance(
    userId: number,
    iban: string,
    amount: number,
    type: UpdateBalance,
  ): Promise<boolean> {
    try {
      const account = await this.accountRepository.findOne({ iban });

      if (!account) throw new NotFoundException('Account not found');

      if (type == UpdateBalance.WITHDRAWAL && account.balance < amount)
        throw new NotFoundException('Insufficient not found');

      const transactionStatus = this.getTransactionStatus(amount);
      const transaction = this.createTransaction(
        userId,
        account,
        amount,
        type,
        transactionStatus,
      );

      if (transactionStatus === TransactionStatus.PENDING) {
        this.logger.info(
          `Transaction created: ${{ userId, iban, amount, type }}}`,
        );
        await this.transactionRepository.create(transaction);
        return true;
      }

      await this.dbTransactionService.executeTransaction(async () => {
        const command = this.getCommand(type, account, amount);
        await this.execute(command);
        await this.transactionRepository.create(transaction);
        this.logger.info(
          `Transaction executed and created: ${{
            userId,
            iban,
            amount,
            type,
          }}}`,
        );
      });

      return Promise.resolve(true);
    } catch (error) {
      this.logger.error(error);
      return Promise.resolve(false);
    }
  }

  public async applyTransaction(
    id: number,
    type: UpdateBalance,
    amount: number,
  ): Promise<void> {
    try {
      const account = await this.accountRepository.findById(id);

      if (!account) {
        throw new NotFoundException('Account not found');
      }
      const command = this.getCommand(type, account, amount);
      await this.execute(command);
      this.logger.info(`Transaction with id:${id} applied`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async transferMoney({
    amount,
    userId,
    sourceAccountIban,
    destinationAccountIban,
    type,
  }: TransferMoneyInput): Promise<boolean> {
    try {
      const [sourceAccount, destinationAccount] = await Promise.all([
        this.accountRepository.findOne({
          iban: sourceAccountIban,
        }),
        this.accountRepository.findOne({
          iban: destinationAccountIban,
        }),
      ]);

      if (!sourceAccount)
        throw new NotFoundException('Source account not found');
      if (!destinationAccount)
        throw new NotFoundException('Destination account not found');
      if (destinationAccount.balance < amount)
        throw new NotFoundException('Insufficient not found');

      const transactionStatus = this.getTransactionStatus(amount);

      if (transactionStatus === TransactionStatus.PENDING) {
        await this.transactionRepository.create({
          amount,
          destinationAcc: destinationAccount.id,
          type,
          user: { id: userId },
          status: transactionStatus,
        });
        return true;
      }

      await this.dbTransactionService.executeTransaction(async () => {
        const withdrawCommand = this.getCommand(
          UpdateBalance.WITHDRAWAL,
          sourceAccount,
          amount,
        );
        const depositCommand = this.getCommand(
          UpdateBalance.DEPOSIT,
          destinationAccount,
          amount,
        );

        await withdrawCommand.execute();

        await depositCommand.execute();

        await this.transactionRepository.create({
          amount,
          sourceAcc: sourceAccount,
          destinationAcc: destinationAccount,
          type,
          user: sourceAccount.user,
          status:
            amount <= TRANFER_AMOUNT_LIMIT
              ? TransactionStatus.ACCEPTED
              : TransactionStatus.PENDING,
        });
      });

      this.logger.info('Transfer successfull');

      return Promise.resolve(true);
    } catch (error) {
      this.logger.error('Error during transfer', error);
      return Promise.resolve(false);
    }
  }

  public async getSavingAccounts(
    type: SavingAccountType,
  ): Promise<AccountModel[]> {
    return this.accountRepository.getSavingAccounts(type);
  }

  public async update(
    id: number,
    account: Partial<AccountModel>,
  ): Promise<AccountModel> {
    return this.accountRepository.updateById(id, account);
  }

  public async deleteAccount(iban, userId): Promise<boolean> {
    const account = await this.accountRepository.findOne({
      iban,
      user: { id: userId },
    });
    if (!account) throw new NotFoundException();
    return this.accountRepository.softDeleteById(account.id);
  }

  private getTransactionStatus(amount: number): TransactionStatus {
    return amount > TRANFER_AMOUNT_LIMIT
      ? TransactionStatus.PENDING
      : TransactionStatus.ACCEPTED;
  }

  private createTransaction(
    userId: number,
    account: AccountEntity,
    amount: number,
    type: UpdateBalance,
    transactionStatus: TransactionStatus,
  ) {
    return {
      amount,
      destinationAcc: account,
      type,
      user: { id: userId },
      status: transactionStatus,
    };
  }

  private getCommand(
    type: UpdateBalance,
    account: AccountEntity,
    amount: number,
  ): DepositCommand | WithdrawCommand {
    return type === UpdateBalance.DEPOSIT
      ? new DepositCommand(this.accountRepository, account, amount)
      : new WithdrawCommand(this.accountRepository, account, amount);
  }

  private calculateInterestPayDates(month = 1): {
    lastInterestPayDate: Date;
    nextInterestPayDate: Date;
  } {
    const currentDate = new Date();
    const nextPaymentDate = currentDate.setMonth(
      currentDate.getMonth() + month,
    );

    return {
      lastInterestPayDate: new Date(),
      nextInterestPayDate: new Date(nextPaymentDate),
    };
  }
}
