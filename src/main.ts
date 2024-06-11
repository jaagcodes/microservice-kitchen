import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { redisConfig } from './redis.config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: '*', // Puedes especificar una URL específica o un array de URLs permitidas
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  
  app.connectMicroservice<MicroserviceOptions>(redisConfig);

  await app.startAllMicroservices();

  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);
}
bootstrap();
