import { Injectable } from '@nestjs/common';

import { Logger } from '@app/logger';
import { BaseTransaction } from '@app/common';
import { AccountEntity, AccountParamsEntity, SavingAccountStatus, SavingAccountType } from '@app/account';

import { UpdateSavingAccountData } from '../interfaces/update-saving-accounts';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class UpdateSavingAccountsTransaction extends BaseTransaction<UpdateSavingAccountData, void> {
  constructor(connection: DataSource, logger: Logger) {
    super(connection, logger);
  }

  public async execute({ accounts, type }: UpdateSavingAccountData, manager: EntityManager) {
    const promises = accounts.map(async (acc) => {
      const { params } = acc;
      const { amount, interestRate, interestAmount, interestPayCount } = params;

      const currentBalance = Number(amount);
      const currentInterestRate = Number(interestRate);
      const newInterestAmount = (currentBalance * currentInterestRate).toFixed(2);

      const currentDate = new Date();

      const monthIncrementValue = type == SavingAccountType.FIXED_DEPOSIT ? params.term : 1;

      await manager.getRepository(AccountParamsEntity).update(params.id, {
        interestAmount: Number(interestAmount) + Number(newInterestAmount),
        interestPayCount: interestPayCount + monthIncrementValue,
        lastInterestPayDate: new Date(),
        nextInterestPayDate: new Date(currentDate.setMonth(currentDate.getMonth() + monthIncrementValue))
      });

      const updatedAccountParams = await manager.getRepository(AccountParamsEntity).findOne({
        where: {
          id: params.id
        }
      });

      if (type == SavingAccountType.FIXED_DEPOSIT && updatedAccountParams.interestPayCount === updatedAccountParams.term) {
        await manager.getRepository(AccountParamsEntity).update(params.id, {
          status: SavingAccountStatus.CLOSED
        });
      }

      if (type == SavingAccountType.TERM_DEPOSIT && updatedAccountParams.interestPayCount === updatedAccountParams.term) {
        await manager.getRepository(AccountParamsEntity).update(params.id, {
          status: SavingAccountStatus.CLOSED
        });
      }

      await manager.getRepository(AccountEntity).update(acc.id, {
        balance: Number(acc.balance) + Number(newInterestAmount)
      });
    });

    for await (const promise of promises) {
      await promise;
    }
  }
}
