import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthLibModule } from '@app/auth';

@Module({
  imports: [AuthLibModule],
  controllers: [AuthController],
})
export class AuthModule {}
