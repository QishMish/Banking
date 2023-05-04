import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, registerAs } from '@nestjs/config';
import { JwtLibService, CryptoService, PaginationService } from './services';

const utilsConfig = registerAs('utils', () => ({
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRATION_TIME:
    +process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME:
    +process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
}));

@Module({
  imports: [ConfigModule.forFeature(utilsConfig), JwtModule],
  providers: [JwtLibService, CryptoService, PaginationService],
  exports: [JwtLibService, CryptoService, PaginationService],
})
export class UtilsModule {}
