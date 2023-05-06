import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { UserLibModule } from '@app/user';
import { UtilsModule } from '@app/utils';

import { AuthService } from './auth.service';
import { JwtRefreshStrategy, JwtStrategy, LocalStrategy } from './strategies';

const authConfig = registerAs('auth', () => ({
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: +process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: +process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME
}));
@Module({
  imports: [PassportModule, ConfigModule.forFeature(authConfig), forwardRef(() => UserLibModule), UtilsModule],
  providers: [AuthService, JwtStrategy, LocalStrategy, JwtRefreshStrategy],
  exports: [AuthService]
})
export class AuthLibModule {}
