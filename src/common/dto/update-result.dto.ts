import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ObjectLiteral, UpdateResult } from 'typeorm';

export class UpdateResultDto extends UpdateResult {
  @ApiProperty({ type: 'any' })
  raw: any;

  @ApiPropertyOptional({
    type: Number,
  })
  affected?: number;

  @ApiProperty({ type: ['object'] })
  generatedMaps: ObjectLiteral[];
}
