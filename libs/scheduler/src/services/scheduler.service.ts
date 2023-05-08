import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { Logger } from '@app/logger';
import { AccountService, SavingAccountType } from '@app/account';
import { UpdateSavingAccountsTransaction } from '@app/account-transaction';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly accountService: AccountService,
    private readonly updateSavingAccountTransaction: UpdateSavingAccountsTransaction,
    private readonly logger: Logger
  ) {}
  @Cron('*/30 * * * * *')
  public async savingAccountScheduler() {
    const accountsMap = new Map([
      [SavingAccountType.TERM_DEPOSIT, this.accountService.getSavingAccounts(SavingAccountType.TERM_DEPOSIT)],
      [SavingAccountType.FIXED_DEPOSIT, this.accountService.getSavingAccounts(SavingAccountType.FIXED_DEPOSIT)]
    ]);

    for await (const [key, value] of accountsMap) {
      this.logger.log(`Retrieved ${key}: ${JSON.stringify(value)}`);
      const accounts = await value;
      console.log(key, accounts);
      await this.updateSavingAccountTransaction.run({
        accounts: accounts,
        type: key
      });
      this.logger.log(`${key} updated:  ${JSON.stringify(value)}`);
    }

    return void 0;
  }
}
