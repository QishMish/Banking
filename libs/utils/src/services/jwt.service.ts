import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { JWTAuthPayload } from '@app/auth';

@Injectable()
export class JwtLibService {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

  public signJwtAccessToken(payload: JWTAuthPayload, options?: JwtSignOptions): Promise<string> {
    const secret = options?.secret || this.configService.get('JWT_ACCESS_TOKEN_SECRET');
    const expiresIn = options?.expiresIn || this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME') + 's';
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn
    });
  }

  public signJwtRefreshToken(payload: JWTAuthPayload, options?: JwtSignOptions): Promise<string> {
    const secret = options?.secret || this.configService.get('JWT_REFRESH_TOKEN_SECRET');
    const expiresIn = options?.expiresIn || this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME') + 's';

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn
    });
  }
}
