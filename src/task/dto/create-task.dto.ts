import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  MaxLength,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    type: String,
    description: 'Title (length is from 1 to 50 symbols).',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, {
    message: 'Title is too long. Max length is 50 symbols.',
  })
  title: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Description (max length is 500 symbols and is optional).',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  // @IsNotEmpty()
  @MaxLength(500, {
    message: 'Description is too long. Max length is 500 symbols.',
  })
  description?: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Estimated time (only integer and is optional).',
  })
  @IsOptional()
  @IsInt()
  estimatedTime?: number;
}
