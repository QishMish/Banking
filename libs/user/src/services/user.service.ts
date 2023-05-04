import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PaginationResult } from '@app/utils';
import { PaginationService, builder } from '@app/utils';
import { FindUsers, UserRepository } from '../interfaces';
import { User, UserModel } from '../interfaces';
import { USER_REPOSITORY } from '../constants';
import { UserStatuses } from '../types';
import { FindOptions } from '@app/common';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly paginationService: PaginationService,
  ) {}

  public create(user: User): Promise<UserModel> {
    return this.userRepository.create(user);
  }

  public find(options?: FindUsers): Promise<PaginationResult<UserModel>> {
    const {
      id,
      email,
      role,
      identityNumber,
      page = 1,
      pageSize = 15,
      status,
    } = options;
    const { skip, limit } = this.paginationService.getPaginationProps({
      page,
      pageSize,
    });
    const findOptions = builder<FindUsers>(options)
      .id(id)
      .email(email)
      .role(role)
      .identityNumber(identityNumber)
      .status(status)
      .skip(skip)
      .limit(limit)
      .build();

    return this.userRepository.findAll(findOptions);
  }

  public async findById(id: number): Promise<UserModel | never> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  public async findOne(
    findOptions: FindOptions<UserModel>,
  ): Promise<UserModel | never> {
    const user = await this.userRepository.findOne(findOptions);

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  public updateById(id: number, user: Partial<UserModel>): Promise<UserModel> {
    return this.userRepository.updateById(id, user);
  }

  public deleteById(id: number): Promise<boolean> {
    return this.userRepository.softDeleteById(id);
  }

  public setRefreshToken(id: number, refreshToken: string): Promise<UserModel> {
    return this.userRepository.updateById(id, { refreshToken });
  }

  public removeRefreshToken(id: number): Promise<boolean> {
    return this.userRepository
      .updateById(id, {
        refreshToken: null,
      })
      .then((result) => !!result);
  }

  public checkEmailAvailability(email: string): Promise<boolean> {
    return this.userRepository
      .findOne({
        email,
      })
      .then((result) => !result);
  }

  public activate(id: number): Promise<boolean> {
    return this.updateStatus(id, UserStatuses.ACTIVE);
  }

  public deactivate(id: number): Promise<boolean> {
    return this.updateStatus(id, UserStatuses.SUSPENDED);
  }

  public updateStatus(id: number, status: UserStatuses): Promise<boolean> {
    return this.userRepository
      .updateById(id, { status })
      .then((result) => !!result);
  }
}
