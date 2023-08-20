import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TUserJwtData } from '../interfaces/user-jwt-data.interface';

export const AuthUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user = <TUserJwtData>request.user;

    return data ? user?.[data] : user;
  },
);
