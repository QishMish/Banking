import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginationResult } from '@app/utils';

import { FindUsers, UserRepository } from '../interfaces';
import { UserEntity } from '../entities';

@Injectable()
export class UserTypeOrmRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  public create(entity: unknown): Promise<UserEntity> {
    return this.userRepository.save(entity as UserEntity);
  }

  public find(findManyOptions: Partial<UserEntity>): Promise<[] | UserEntity[]> {
    return this.userRepository.find({
      where: findManyOptions
    });
  }

  public async findAll(options: FindUsers): Promise<PaginationResult<UserEntity>> {
    const { id, page, pageSize, skip, limit, ...whereOptions } = options;

    const queryBuilder = this.userRepository.createQueryBuilder('users');

    if (id) {
      queryBuilder.where('users.id = :id', { id });
    } else {
      queryBuilder.where('1 = 1');
    }

    for (const [key, value] of Object.entries(whereOptions)) {
      if (value !== undefined) {
        queryBuilder.andWhere(`users.${key} = :${key}`, {
          [key]: value
        });
      }
    }

    const [users, count] = await queryBuilder.orderBy('users.createdAt', 'DESC').skip(skip).take(limit).getManyAndCount();

    return {
      page,
      pageSize,
      total: count,
      totalPages: count,
      data: users
    };
  }

  public findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id }
    });
  }

  public findOne(findOptions: Partial<UserEntity>): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: findOptions
    });
  }

  public async updateById(id: number, entity: Partial<UserEntity>): Promise<UserEntity> {
    await this.userRepository.update({ id }, entity);
    return this.findById(id);
  }

  public deleteById(id: number): Promise<boolean> {
    return this.userRepository.delete({ id }).then((result) => !!result.affected);
  }

  public softDeleteById(id: number): Promise<boolean> {
    return this.userRepository.softDelete({ id }).then((result) => !!result.affected);
  }
}
