import { Module } from '@nestjs/common';
import { InterestService } from './services/interest.service';
import { INTEREST_REPOSITORY } from './constants';
import { InterestTypeOrmRepository } from './repositories/interest-typeorm.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterestEntity } from './entities';
import { SEEDER_REPOSITORY } from '@app/seeder/contants';

@Module({
  imports: [TypeOrmModule.forFeature([InterestEntity])],
  providers: [
    InterestService,
    {
      provide: INTEREST_REPOSITORY,
      useClass: InterestTypeOrmRepository,
    },
    {
      provide: SEEDER_REPOSITORY,
      useClass: InterestTypeOrmRepository,
    },
  ],
  exports: [InterestService, INTEREST_REPOSITORY, SEEDER_REPOSITORY],
})
export class InterestModule {}
