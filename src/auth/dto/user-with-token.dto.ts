import { TUserJwtData } from '@src/common/interfaces/user-jwt-data.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IAuthRO } from '../auth.service';
import { Role } from '@src/user/entities/user.entity';

export class JwtUserData implements TUserJwtData {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ enum: Role, enumName: 'Role', isArray: true })
  role: Role[];
}

export class UserWithTokenDto implements IAuthRO {
  @ApiProperty({ type: JwtUserData })
  user: JwtUserData;

  @ApiProperty({
    type: String,
  })
  jwtToken: string;
}
