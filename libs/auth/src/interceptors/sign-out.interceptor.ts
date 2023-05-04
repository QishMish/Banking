import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response as ExpressResponse } from 'express';
import { AuthService } from '../auth.service';
@Injectable()
export class SignOutResponseInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ExpressResponse> {
    const response: ExpressResponse = context.switchToHttp().getResponse();

    response.setHeader('Set-Cookie', this.authService.generateLogOutCookie());

    return next.handle();
  }
}
