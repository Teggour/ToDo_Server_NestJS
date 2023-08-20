import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { TUserJwtData } from '@src/common/interfaces/user-jwt-data.interface';
import { Role } from '@src/user/entities/user.entity';

@Injectable()
export class CurrentUserOrAdminInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    const paramsId = +request.params.id;
    const { id: userId, role } = <TUserJwtData>request.user;

    const isCurrent = userId === paramsId;
    const isAdmin = role.includes(Role.Admin);

    if (isCurrent || isAdmin) {
      return next.handle();
    }

    throw new UnauthorizedException('You do not have a permission!');
  }
}
