import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  MinLength,
  MaxLength,
  IsString,
  IsNotEmpty,
} from 'class-validator';

// TODO: replace with PickType from register.dto
export class LoginDto {
  @ApiProperty({
    type: String,
    description: 'Only email!',
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
