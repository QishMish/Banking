import { AccountModel, AccountRepository, Command } from '../interfaces';
import { BadRequestException } from '@nestjs/common';

export class WithdrawCommand implements Command {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly account: AccountModel,
    private readonly amount: number,
  ) {}

  public async execute(): Promise<boolean> {
    const hasEnoughBalance = await this.hasEnoughBalance(
      this.account,
      this.amount,
    );
    if (!hasEnoughBalance)
      throw new BadRequestException('Insufficient balance');

    return this.accountRepository
      .updateById(this.account.id, {
        balance: this.account.balance - this.amount,
      })
      .then((result) => !!result);
  }
  private async hasEnoughBalance(
    account: AccountModel,
    amount: number,
  ): Promise<boolean> {
    return account.balance >= amount;
  }
}
