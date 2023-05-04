import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UseInterceptors } from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService, User } from '@app/auth';
import { UserModel } from '@app/user';
import { JwtAuthGuard } from '@app/auth/guards';
import { RequestWithUser } from './interfaces';
import { SignInDto, SignUpDto } from './dtos';

@ApiTags('Auth')
@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @Throttle(20, 60)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(ClassSerializerInterceptor)
  public async signUp(
    @Body() signUpUser: SignUpDto,
    @Req() request: RequestWithUser<UserModel>,
  ): Promise<UserModel> {
    const user = await this.authService.signUpUser(signUpUser);
    const { id: userId, username, email } = user;

    const { cookie: accessTokenCookie } =
      await this.authService.generateJwtAccesTokenCookie({
        userId,
        username,
        email,
      });
    const { cookie: refreshTokenCookie, token: refreshToken } =
      await this.authService.generateJwtRefreshTokenCookie({
        userId,
        username,
        email,
      });

    await this.authService.setRefreshToken(userId, refreshToken);

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    return user;
  }

  @Post('sign-in')
  @Throttle(20, 60)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  public async signIn(
    @Body() signInUser: SignInDto,
    @Request() { user, res }: RequestWithUser<UserModel>,
  ): Promise<UserModel> {
    const { id: userId, username, email } = user;

    const { cookie: accessTokenCookie } =
      await this.authService.generateJwtAccesTokenCookie({
        userId,
        username,
        email,
      });

    const { cookie: refreshTokenCookie, token: refreshToken } =
      await this.authService.generateJwtRefreshTokenCookie({
        userId,
        username,
        email,
      });

    await this.authService.setRefreshToken(userId, refreshToken);

    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return user;
  }

  @Post('refresh-token')
  @Throttle(20, 60)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard('jwt-refresh-token'))
  @HttpCode(HttpStatus.ACCEPTED)
  public async refreshToken(
    @Request() { user, res }: RequestWithUser<UserModel>,
  ) {
    const { id: userId, username, email } = user;

    const { cookie: accessTokenCookie } =
      await this.authService.generateJwtAccesTokenCookie({
        userId,
        username,
        email,
      });

    const { cookie: refreshTokenCookie, token: refreshToken } =
      await this.authService.generateJwtRefreshTokenCookie({
        userId,
        username,
        email,
      });

    await this.authService.setRefreshToken(userId, refreshToken);

    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return user;
  }

  @Get('sign-out')
  @Throttle(20, 60)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  public async signOut(@User() user: UserModel): Promise<boolean> {
    return this.authService.removeRefreshToken(user.id);
  }

  @Get('me')
  @Throttle(20, 60)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public currentUser(@User() user: UserModel): UserModel {
    return user;
  }
}
