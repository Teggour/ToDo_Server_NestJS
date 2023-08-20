import { User } from '@src/user/entities/user.entity';

export type TUserJwtData = Pick<User, 'id' | 'email' | 'role'>;
