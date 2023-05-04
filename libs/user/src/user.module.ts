import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UtilsModule } from '@app/utils';
import { UserService } from './services';
import { UserEntity } from './entities';
import { UserTypeOrmRepository } from './repositories';
import { USER_REPOSITORY } from './constants';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UtilsModule],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserTypeOrmRepository,
    },
  ],
  exports: [UserService, USER_REPOSITORY],
})
export class UserLibModule {}
