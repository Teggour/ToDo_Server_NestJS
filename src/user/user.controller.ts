import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { AuthUser } from '@src/common/decorators/auth-user.decorator';
import { Roles } from '@src/auth/decorators/roles.decorator';
import { Role, User } from './entities/user.entity';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { TransformResponseInterceptor } from '@src/common/interceptors/transform-response.interceptor';
import { ResponseMessage } from '@src/common/decorators/response-message.decorator';
import { TUserJwtData } from '@src/common/interfaces/user-jwt-data.interface';
import { CurrentUserOrAdminInterceptor } from './interceptors/current-user-or-admin.interceptor';
import { HttpExceptionBodyDto } from '@src/common/dto/http-exception-body.dto';
import { ApiTransformedOkResponse } from '@src/common/decorators/api-transformed-response.decorator';
import { UpdateResultDto } from '@src/common/dto/update-result.dto';
import { DeleteResultDto } from '@src/common/dto/delete-result.dto';

@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@ApiTags('User')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  type: HttpExceptionBodyDto,
  description:
    'Unauthorized response. You have to add a Bearer Token to request!',
})
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @UsePipes(new ValidationPipe())
  @Roles(Role.Admin)
  @ResponseMessage('User created.')
  @ApiTransformedOkResponse({ model: User })
  @ApiBadRequestResponse({
    type: HttpExceptionBodyDto,
    description: 'Bad request. Email field must be unique!',
  })
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('getMe')
  @ApiTransformedOkResponse({ model: User })
  @ApiNotFoundResponse({
    type: HttpExceptionBodyDto,
    description:
      'Not found response. ID (from Bearer Token) must be contained in DB!',
  })
  getMe(@AuthUser() userData: TUserJwtData) {
    return this.userService.getMe(userData);
  }

  // TODO: add pagination and sort
  @Get('getAll')
  @Roles(Role.Admin)
  @ApiTransformedOkResponse({ model: User, isArray: true })
  @ApiUnauthorizedResponse({
    type: HttpExceptionBodyDto,
    description: `Unauthorized response. Only for ${Role.Admin.toUpperCase()}!`,
  })
  getAll() {
    return this.userService.findAll();
  }

  @Get('getById/:id')
  @ApiTransformedOkResponse({ model: User })
  @ApiNotFoundResponse({
    type: HttpExceptionBodyDto,
    description: 'Not found response. ID must be contained in DB!',
  })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOneById(id);
  }

  @Get('getByEmail/:email')
  @ApiParam({
    name: 'email',
    description: 'Only email!',
    required: true,
    type: String,
    example: 'email@mail.com',
  })
  @ApiTransformedOkResponse({ model: User })
  @ApiNotFoundResponse({
    type: HttpExceptionBodyDto,
    description: 'Not found response. Email must be contained in DB!',
  })
  getByEmail(@Param('email') email: string) {
    return this.userService.findOneByEmail(email);
  }

  @Patch('update/:id')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(CurrentUserOrAdminInterceptor)
  @ResponseMessage('User updated.')
  @ApiBody({ type: UpdateUserDto })
  @ApiTransformedOkResponse({ model: User })
  @ApiUnauthorizedResponse({
    type: HttpExceptionBodyDto,
    description: `Unauthorized response. Only for current user (by Bearer Token) or ${Role.Admin.toUpperCase()}!`,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('update-role/:id')
  @UsePipes(new ValidationPipe())
  @Roles(Role.Admin)
  @ResponseMessage('User role updated.')
  @ApiBody({ type: UpdateUserRoleDto })
  @ApiUnauthorizedResponse({
    type: HttpExceptionBodyDto,
    description: `Unauthorized response. Only for ${Role.Admin.toUpperCase()}!`,
  })
  @ApiTransformedOkResponse({ model: UpdateResultDto })
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.userService.updateRole(id, updateUserRoleDto);
  }

  @Delete('delete/:id')
  @UseInterceptors(CurrentUserOrAdminInterceptor)
  @ResponseMessage('User deleted.')
  @ApiUnauthorizedResponse({
    type: HttpExceptionBodyDto,
    description: `Unauthorized response. Only for current user (by Bearer Token) or ${Role.Admin.toUpperCase()}!`,
  })
  @ApiTransformedOkResponse({ model: DeleteResultDto })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
