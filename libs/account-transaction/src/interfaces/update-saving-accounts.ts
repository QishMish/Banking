import { AccountModel, SavingAccountType } from '@app/account';

interface UpdateSavingAccountData {
  accounts: AccountModel[];
  type: SavingAccountType;
}

export { UpdateSavingAccountData };
