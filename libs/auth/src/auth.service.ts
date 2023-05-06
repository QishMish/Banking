import { BadGatewayException, BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserModel, UserService } from '@app/user';
import { CryptoService, JwtLibService } from '@app/utils';

import { AuthTokenWithCookiesResponse, JWTAuthPayload, SignUpUser } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtLibService,
    private readonly cryptoService: CryptoService,
    private readonly configService: ConfigService
  ) {}

  public async signUpUser(user: SignUpUser): Promise<UserModel> {
    const emailIsAvailable = await this.userService.checkEmailAvailability(user.email);

    if (!emailIsAvailable) throw new BadRequestException('User with corresponding email already exist');

    this.validateConfirmPassword(user.password, user.confirmPassword);

    const hashedPassword = await this.cryptoService.hash(user.password);

    try {
      const newUser = await this.userService.create({
        ...user,
        password: hashedPassword
      });

      return newUser;
    } catch (error) {
      if (error?.code === '23505') {
        throw new BadRequestException('User with that email already exists');
      }
      throw new InternalServerErrorException('Something went wrong during signing up');
    }
  }

  public async findUser(email: string, password: string): Promise<UserModel> {
    const user = await this.userService.findOne({
      email
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    await this.validatePassword(password, user.password);

    return user;
  }

  public async generateJwtAccesTokenCookie(payload: JWTAuthPayload): Promise<AuthTokenWithCookiesResponse> {
    const accesstoken = await this.jwtService.signJwtAccessToken(payload);

    const cookie = `AccessToken=${accesstoken}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;

    return {
      cookie,
      token: accesstoken
    };
  }

  public async generateJwtRefreshTokenCookie(payload: JWTAuthPayload): Promise<AuthTokenWithCookiesResponse> {
    const refreshToken = await this.jwtService.signJwtRefreshToken(payload);

    const cookie = `RefreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`;

    return {
      cookie,
      token: refreshToken
    };
  }

  public generateLogOutCookie(): string[] {
    return ['AccessToken=; HttpOnly; Max-Age=0', 'RefreshToken=; HttpOnly; Max-Age=0'];
  }

  public async setRefreshToken(userId: number, refreshToken: string): Promise<boolean | UserModel> {
    return this.userService.setRefreshToken(userId, refreshToken);
  }

  public removeRefreshToken(userId: number): Promise<boolean> {
    return this.userService.removeRefreshToken(userId);
  }

  private validateConfirmPassword(password: string, confirmPassword: string): void | never {
    if (password !== confirmPassword)
      throw new BadGatewayException({
        message: 'Passwords does not match'
      });
  }

  private validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return this.cryptoService.compareHashs(password, hashedPassword).then((result) => {
      if (result) {
        return true;
      }
      throw new UnauthorizedException();
    });
  }
}
