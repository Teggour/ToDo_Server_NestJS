import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserService } from '@src/user/user.service';
import { User } from '@src/user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TUserJwtData } from '@src/common/interfaces/user-jwt-data.interface';

export interface IAuthRO {
  user: TUserJwtData;
  jwtToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: LoginDto) {
    const user = await this.userService.findOneByEmail(email);
    const userPassword = await this.userService.getPasswordByEmail(email);

    const passwordIsMatch = await argon2.verify(userPassword, password);

    if (user && passwordIsMatch) {
      return user;
    }

    throw new UnauthorizedException('Email or password is incorrect!');
  }

  async register(userPayload: RegisterDto) {
    const user = await this.userService.create(userPayload);

    return user;
  }

  async login(user: User) {
    return this.getUserWithToken(user);
  }

  async profile(userData: TUserJwtData) {
    const user = await this.userService.getMe(userData);

    return user;
  }

  private getUserWithToken(user: Omit<User, 'password'>): IAuthRO {
    const { id, email, role } = user;

    const jwtUserData: TUserJwtData = { id, email, role };

    return {
      user: jwtUserData,
      jwtToken: this.jwtService.sign(jwtUserData),
    };
  }
}
