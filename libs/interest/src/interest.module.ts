import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SEEDER_REPOSITORY } from '@app/seeder/constants';

import { INTEREST_REPOSITORY } from './constants';
import { InterestTypeOrmRepository } from './repositories';
import { InterestEntity } from './entities';
import { InterestService } from './services/interest.service';

@Module({
  imports: [TypeOrmModule.forFeature([InterestEntity])],
  providers: [
    InterestService,
    {
      provide: INTEREST_REPOSITORY,
      useClass: InterestTypeOrmRepository
    },
    {
      provide: SEEDER_REPOSITORY,
      useClass: InterestTypeOrmRepository
    }
  ],
  exports: [InterestService, INTEREST_REPOSITORY, SEEDER_REPOSITORY]
})
export class InterestModule {}
