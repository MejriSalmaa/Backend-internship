/* eslint-disable prettier/prettier */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('The API description')
    .addTag('api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Middleware
  app.use(cookieParser());

  // Serve static files from the "uploads" directory
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  // CORS configuration
  app.enableCors({
    origin: true, // Allow both origins
    credentials: true, // Enable sending cookies from the frontend
  });

  await app.listen(3000);
}
bootstrap();
