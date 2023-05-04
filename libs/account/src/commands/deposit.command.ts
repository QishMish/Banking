import { AccountModel, AccountRepository, Command } from '../interfaces';

export class DepositCommand implements Command {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly account: AccountModel,
    private readonly amount: number,
  ) {}

  public async execute(): Promise<boolean> {
    return this.accountRepository
      .updateById(this.account.id, {
        balance: Number(this.account.balance) + this.amount,
      })
      .then((result) => !!result);
  }
}
