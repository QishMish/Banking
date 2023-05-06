import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '@app/common';
import { UtilsModule } from '@app/utils';
import { InterestModule } from '@app/interest';

import { AccountService, AccountParamsService } from './services';
import { AccountEntity, AccountHistoryEntity, AccountParamsEntity } from './entities';
import { ACCOUNT_HISTORY_REPOSITORY, ACCOUNT_PARAMS_REPOSITORY, ACCOUNT_REPOSITORY } from './constants';
import { AccountTypeOrmRepository, AccountParamsTypeOrmRepository, AcountHistoryTypeormRepository } from './repositories';
import { AccountSubscriber } from './subscribers';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity, AccountParamsEntity, AccountHistoryEntity]),
    CommonModule,
    UtilsModule,
    InterestModule
  ],
  providers: [
    AccountService,
    AccountParamsService,
    AccountSubscriber,
    {
      provide: ACCOUNT_REPOSITORY,
      useClass: AccountTypeOrmRepository
    },
    {
      provide: ACCOUNT_PARAMS_REPOSITORY,
      useClass: AccountParamsTypeOrmRepository
    },
    {
      provide: ACCOUNT_HISTORY_REPOSITORY,
      useClass: AcountHistoryTypeormRepository
    }
  ],
  exports: [AccountService, AccountParamsService]
})
export class AccountLibModule {}
