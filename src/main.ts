import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set prefix to API
  app.setGlobalPrefix('api');

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ToDo App')
    .setDescription('ToDo App API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerOptions: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    // ignoreGlobalPrefix: false, // TODO: check why it doesn't work
  };

  const swaggerDocument = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerOptions,
  );

  SwaggerModule.setup('swagger', app, swaggerDocument);

  // Config Service
  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('PORT') || 3333;

  await app.listen(PORT);
}
bootstrap();
