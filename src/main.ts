/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:5178', 'http://localhost:5174','http://localhost:5173'], // Allow both origins
    credentials: true, // Enable sending cookies from the frontend
  });
  await app.listen(3000);
}
bootstrap();