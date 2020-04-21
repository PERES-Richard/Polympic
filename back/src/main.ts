import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {FastifyAdapter, NestFastifyApplication,} from '@nestjs/platform-fastify'
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  const options = new DocumentBuilder()
      .setTitle('Polympic API')
      .setDescription('L\'API de Polympic pour gérer utilisateurs, incidents et événements')
      .setVersion('1.0')
      .addTag('polympic')
      .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
