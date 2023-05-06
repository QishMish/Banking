import * as Joi from '@hapi/joi';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerModule } from '@app/logger';
import { LogLevel, LoggingProvider } from '@app/logger';
import { SchedulerLibModule } from '@app/scheduler';
import { SeederModule } from '@app/seeder';
import { dataSourceOptions } from '@app/common';

import { TransactionModule } from './transaction/transaction.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        ENV: Joi.string().required(),
        PORT: Joi.number().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        ECS_HOST: Joi.string().required(),
        ECS_PORT: Joi.number().required()
      })
    }),
    LoggerModule.forRoot({
      serviceName: 'fintech',
      engine: LoggingProvider.WINSTON,
      level: LogLevel.DEBUG
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    HealthModule,
    AuthModule,
    AccountModule,
    TransactionModule,
    SchedulerLibModule,
    SeederModule,
    AdminModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ]
})
export class AppModule {}
