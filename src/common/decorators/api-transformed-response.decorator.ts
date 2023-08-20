import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { TransformedOkResponseDto } from '../dto/transformed-ok-response.dto';

export const ApiTransformedOkResponse = <TModel extends Type<any>>({
  model,
  isArray = false,
  description = 'OK response.',
}: {
  model: TModel;
  isArray?: boolean;
  description?: string;
}) =>
  applyDecorators(
    ApiExtraModels(TransformedOkResponseDto<TModel>, model),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(TransformedOkResponseDto) },
          {
            properties: {
              data: !isArray
                ? {
                    $ref: getSchemaPath(model),
                  }
                : {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  },
            },
          },
        ],
      },
    }),
  );
