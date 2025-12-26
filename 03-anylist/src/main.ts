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
  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);

  console.log(`App running on port ${PORT}`);
}
bootstrap();
