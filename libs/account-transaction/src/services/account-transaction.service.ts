import { Injectable } from '@nestjs/common';

import { UpdateBalanceTransaction, TransferMoneyTransaction, AcceptTransaction, DeclineTransaction } from '../repositories';
import { AccountData, ChangedTransactionStatus, TransferData, TransferedMoney, UserWithBalance } from '../interfaces';

@Injectable()
export class AccountTransactionService {
  constructor(
    private readonly updateUserBalanceService: UpdateBalanceTransaction,
    private readonly transferMoneyService: TransferMoneyTransaction,
    private readonly acceptTransaction: AcceptTransaction,
    private readonly declineTransaction: DeclineTransaction
  ) {}

  public updateBalance(accountData: AccountData): Promise<UserWithBalance> {
    return this.updateUserBalanceService.run(accountData);
  }

  public transferMoney(transferData: TransferData): Promise<TransferedMoney> {
    return this.transferMoneyService.run(transferData);
  }

  public async accept(id: number): Promise<ChangedTransactionStatus> {
    return this.acceptTransaction.run({ id });
  }

  public async decline(id: number): Promise<ChangedTransactionStatus> {
    return this.declineTransaction.run({ id });
  }
}
