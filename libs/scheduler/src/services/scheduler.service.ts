import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { Logger } from '@app/logger';
import { DbTransactionService } from '@app/common/db-transaction.service';
import { AccountModel, AccountParamsService, AccountService, SavingAccountStatus, SavingAccountType } from '@app/account';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly accountService: AccountService,
    private readonly accountParamsService: AccountParamsService,
    private readonly dbTransactionService: DbTransactionService,
    private readonly logger: Logger
  ) {}
  @Cron('*/10 * * * * *')
  public async accountScheduler() {
    const accountsMap = new Map([
      [SavingAccountType.TERM_DEPOSIT, undefined],
      [SavingAccountType.FIXED_DEPOSIT, undefined]
    ]);

    const promises = [
      this.accountService.getSavingAccounts(SavingAccountType.TERM_DEPOSIT),
      this.accountService.getSavingAccounts(SavingAccountType.FIXED_DEPOSIT)
    ];

    const accountsResult = await Promise.all(promises);

    accountsResult.forEach((acc, index) => {
      accountsMap.set(Array.from(accountsMap.keys())[index], acc);
    });

    this.logger.log(`Retrieved saving accounts: ${JSON.stringify(accountsResult)}`);

    await Promise.all([
      this.updateSavingAccounts(accountsMap.get(SavingAccountType.TERM_DEPOSIT), SavingAccountType.TERM_DEPOSIT),
      this.updateSavingAccounts(accountsMap.get(SavingAccountType.FIXED_DEPOSIT), SavingAccountType.FIXED_DEPOSIT)
    ]);

    this.logger.log(`Saving accounts updated:  ${JSON.stringify(accountsResult)}`);

    return void 0;
  }

  public async updateSavingAccounts(accounts: AccountModel[], type: SavingAccountType) {
    const promises = accounts.map(async (acc) => {
      const { params } = acc;
      const { amount, interestRate, interestAmount, interestPayCount } = params;

      const currentBalance = Number(amount);
      const currentInterestRate = Number(interestRate);
      const newInterestAmount = (currentBalance * currentInterestRate).toFixed(2);

      const currentDate = new Date();

      const monthIncrementValue = type == SavingAccountType.FIXED_DEPOSIT ? params.term : 1;

      this.logger.log(`Starting transaction for account id:${acc.id}`);

      await this.dbTransactionService.executeTransaction(async () => {
        this.logger.log(`Updating transaction params for account id:${acc.id}`);

        const updatedParams = await this.accountParamsService.update(params.id, {
          interestAmount: Number(interestAmount) + Number(newInterestAmount),
          interestPayCount: interestPayCount + monthIncrementValue,
          lastInterestPayDate: new Date(),
          nextInterestPayDate: new Date(currentDate.setMonth(currentDate.getMonth() + monthIncrementValue))
        });

        this.logger.log(`Updating account balance for account id:${acc.id}`);

        await this.accountService.update(acc.id, {
          balance: Number(acc.balance) + Number(newInterestAmount)
        });
        if (updatedParams.term === params.interestPayCount) {
          this.logger.log(`Closing account:${acc}`);

          await this.accountParamsService.update(params.id, {
            status: SavingAccountStatus.CLOSED
          });
          return;
        }
      });

      this.logger.log(`Finished transaction for account id:${acc.id}`);
    });
    return Promise.all(promises);
  }
}
