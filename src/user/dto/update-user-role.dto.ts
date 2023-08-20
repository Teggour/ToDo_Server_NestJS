import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from '../entities/user.entity';

export class UpdateUserRoleDto {
  @ApiProperty({
    enum: Role,
    enumName: 'Role',
    isArray: true,
    description: 'Roles array.',
  })
  @IsEnum(Role, { each: true })
  role: Role[];
}
