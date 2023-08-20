import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { Role } from '@src/user/entities/user.entity';
import { RolesGuard } from '../guards/roles.guard';

export const ROLLES_KEY = 'roles';

export const Roles = (...roles: Role[]) => {
  return applyDecorators(SetMetadata(ROLLES_KEY, roles), UseGuards(RolesGuard));
};
