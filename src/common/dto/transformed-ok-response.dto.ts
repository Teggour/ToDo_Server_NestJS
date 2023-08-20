import { ApiProperty } from '@nestjs/swagger';
import { TransformedOkResponse } from './../interfaces/transformed-ok-response.interface';

export class TransformedOkResponseDto<T> implements TransformedOkResponse<T> {
  data: T;

  @ApiProperty({ type: Number })
  statusCode: number;

  @ApiProperty({ type: String })
  message: string;
}
