import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { initializePublisher } from './utils/rabbitmqPublisher';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Initialize RabbitMQ publisher before server starts
  try {
    await initializePublisher();
  } catch (error) {
    console.error('Failed to initialize RabbitMQ publisher:', error);
    console.warn('Server will start but notifications will not be published');
  }

  // Enable CORS so the Next.js admin app can call this service
  const allowedOrigins = process.env.ADMIN_ORIGIN?.split(',').map((o) =>
    o.trim(),
  ) || ['http://localhost:3000', 'https://ctse-micro-client-admin.vercel.app'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const config = new DocumentBuilder()
    .setTitle('User Service')
    .setDescription('User Service API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  console.log(`User Service running on port ${process.env.PORT ?? 4003} done`);

  await app.listen(process.env.PORT ?? 4003);
}

bootstrap();
