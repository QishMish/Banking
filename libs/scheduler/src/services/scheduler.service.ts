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
  @Cron('*/10 * * * * *')
  public async savingAccountScheduler() {
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

    const activeAccountsPromise = [
      this.updateSavingAccountTransaction.run({
        accounts: accountsMap.get(SavingAccountType.FIXED_DEPOSIT),
        type: SavingAccountType.FIXED_DEPOSIT
      }),
      this.updateSavingAccountTransaction.run({
        accounts: accountsMap.get(SavingAccountType.TERM_DEPOSIT),
        type: SavingAccountType.TERM_DEPOSIT
      })
    ];

    for await (const promise of activeAccountsPromise) {
      await promise;
    }

    this.logger.log(`Saving accounts updated:  ${JSON.stringify(accountsResult)}`);

    return void 0;
  }
}
