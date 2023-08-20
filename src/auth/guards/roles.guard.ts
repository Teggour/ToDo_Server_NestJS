import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@src/user/entities/user.entity';
import { ROLLES_KEY } from '../decorators/roles.decorator';
import { TUserJwtData } from '@src/common/interfaces/user-jwt-data.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  matchRoles(roles: Role[], userRole: Role[]): boolean {
    return roles.some((role) => userRole.includes(role));
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>(ROLLES_KEY, context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { role } = <TUserJwtData>request.user;

    const isMatch = this.matchRoles(roles, role);

    if (isMatch) {
      return isMatch;
    }

    throw new UnauthorizedException('You do not have a permission!');
  }
}
