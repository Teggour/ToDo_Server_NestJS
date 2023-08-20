// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// TODO: check
export class UpdateUserDto extends PartialType(CreateUserDto) {}
