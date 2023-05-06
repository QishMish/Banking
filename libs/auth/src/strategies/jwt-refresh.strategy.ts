import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { CryptoService } from '@app/utils';
import { UserModel, UserService } from '@app/user';

import { JWTAuthPayload } from '../interfaces';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly cryptoService: CryptoService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => request?.cookies?.RefreshToken]),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true
    });
  }

  public async validate(_, payload: JWTAuthPayload): Promise<UserModel> {
    return this.userService.findOne({
      id: payload.userId
    });
  }
}
