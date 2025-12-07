import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true, // forbid unknown fields, desactivate to allow two or mor arguments with different types
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
