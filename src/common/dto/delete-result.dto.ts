import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

export class DeleteResultDto extends DeleteResult {
  @ApiProperty({ type: 'any' })
  raw: any;

  @ApiPropertyOptional({
    oneOf: [{ type: 'number' }, { type: 'null' }],
  })
  affected?: number | null;
}
