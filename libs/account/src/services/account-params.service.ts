import { Inject, Injectable } from '@nestjs/common';

import { AccountParamsModel, AccountParamsRepository } from '../interfaces';
import { ACCOUNT_PARAMS_REPOSITORY } from '../constants/tokens';

@Injectable()
export class AccountParamsService {
  constructor(
    @Inject(ACCOUNT_PARAMS_REPOSITORY)
    private readonly accountParamsRepository: AccountParamsRepository
  ) {}

  public async update(id: number, accountParams: Partial<AccountParamsModel>): Promise<AccountParamsModel> {
    return this.accountParamsRepository.updateById(id, accountParams);
  }
}
