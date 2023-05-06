import { Module } from '@nestjs/common';

import { AuthLibModule } from '@app/auth';

import { AuthController } from './auth.controller';

@Module({
  imports: [AuthLibModule],
  controllers: [AuthController]
})
export class AuthModule {}
