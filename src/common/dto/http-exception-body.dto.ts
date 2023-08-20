import { HttpExceptionBody } from '@nestjs/common/interfaces';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HttpExceptionBodyDto implements HttpExceptionBody {
  @ApiProperty({
    oneOf: [
      { type: 'string' },
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    ],
  })
  message: string | string[];

  @ApiPropertyOptional({
    type: String,
  })
  error?: string;

  @ApiProperty({
    type: Number,
  })
  statusCode: number;
}
