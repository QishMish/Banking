import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLibModule } from '@app/user';
import { TransactionLibModule } from '@app/transaction';
import { CommonModule } from '@app/common';
import { UtilsModule } from '@app/utils';
import { AccountService, AccountParamsService } from './services';
import {
  AccountEntity,
  AccountHistoryEntity,
  AccountParamsEntity,
} from './entities';
import {
  ACCOUNT_HISTORY_REPOSITORY,
  ACCOUNT_PARAMS_REPOSITORY,
  ACCOUNT_REPOSITORY,
} from './constants';
import {
  AccountTypeOrmRepository,
  AccountParamsTypeOrmRepository,
  AcountHistoryTypeormRepository,
} from './repositories';
import { InterestModule } from '@app/interest';
import { AccountSubscriber } from './subscribers';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountEntity,
      AccountParamsEntity,
      AccountHistoryEntity,
    ]),
    TransactionLibModule,
    CommonModule,
    UtilsModule,
    InterestModule,
  ],
  providers: [
    AccountService,
    AccountParamsService,
    AccountSubscriber,
    {
      provide: ACCOUNT_REPOSITORY,
      useClass: AccountTypeOrmRepository,
    },
    {
      provide: ACCOUNT_PARAMS_REPOSITORY,
      useClass: AccountParamsTypeOrmRepository,
    },
    {
      provide: ACCOUNT_HISTORY_REPOSITORY,
      useClass: AcountHistoryTypeormRepository,
    },
  ],
  exports: [AccountService, AccountParamsService],
})
export class AccountLibModule {}
