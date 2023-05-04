import { UserModel } from '@app/user';
import { Request } from 'express';

export interface RequestWithUser<T extends Omit<UserModel, 'password'>>
  extends Request {
  user: T;
}
