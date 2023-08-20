import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  MinLength,
  MaxLength,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    type: String,
    description: 'First name (length is from 1 to 25 symbols).',
    minLength: 1,
    maxLength: 25,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(25, {
    message: 'First name is too long. Max length is 25 symbols.',
  })
  firstName: string;

  @ApiProperty({
    type: String,
    description: 'Last name (length is from 1 to 25 symbols).',
    minLength: 1,
    maxLength: 25,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(25, {
    message: 'Last name is too long. Max length is 25 symbols.',
  })
  lastName: string;

  @ApiProperty({
    type: String,
    description: 'Only email (field is unique)!',
    example: 'email@mail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Password (length is from 6 to 12 symbols).',
    minLength: 6,
    maxLength: 12,
  })
  @IsString()
  @MinLength(6, { message: 'Password is too short. Min length is 6 symbols.' })
  @MaxLength(12, { message: 'Password is too long. Max length is 12 symbols.' })
  password: string;
}
