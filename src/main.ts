import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { Logger } from '@app/logger';
import { SeederService } from '@app/seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(Logger);
  const seeder = app.get(SeederService);

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  
  app.enableCors();

  app.getHttpAdapter().getInstance().disable('x-powered-by');

  const config = new DocumentBuilder()
    .setTitle('Fintech Api')
    .setDescription('Fintech API description')
    .setVersion('1.0')
    .addTag('Fintech')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 8000, () => {
    seeder
      .seed()
      .then(() => {
        logger.log('Seeding complete!');
      })
      .catch((error) => {
        logger.error('Seeding failed!', error);
        throw error;
      });
  });
}
bootstrap();
