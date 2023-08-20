import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthUser } from '../common/decorators/auth-user.decorator';
import { User } from '@src/user/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TransformResponseInterceptor } from '@src/common/interceptors/transform-response.interceptor';
import { ResponseMessage } from '@src/common/decorators/response-message.decorator';
import { TUserJwtData } from '@src/common/interfaces/user-jwt-data.interface';
import { LoginDto } from './dto/login.dto';
import { HttpExceptionBodyDto } from '@src/common/dto/http-exception-body.dto';
import { ApiTransformedOkResponse } from '@src/common/decorators/api-transformed-response.decorator';
import { UserWithTokenDto } from './dto/user-with-token.dto';

@UseInterceptors(TransformResponseInterceptor)
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('You logged in.')
  @ApiBody({ type: LoginDto })
  @ApiUnauthorizedResponse({
    type: HttpExceptionBodyDto,
    description: 'Unauthorized response.',
  })
  // TODO: OK response status is 201 (not 200)
  @ApiTransformedOkResponse({ model: UserWithTokenDto })
  async login(@AuthUser() user: User) {
    return this.authService.login(user);
  }

  @Post('register')
  @ResponseMessage('You registered.')
  @ApiBody({ type: RegisterDto })
  @ApiTransformedOkResponse({ model: User })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiBearerAuth()
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({
    type: HttpExceptionBodyDto,
    description:
      'Unauthorized response. You have to add a Bearer Token to request!',
  })
  @ApiTransformedOkResponse({ model: User })
  getProfile(@AuthUser() user: TUserJwtData) {
    return this.authService.profile(user);
  }
}
