import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import {NestExpressApplication} from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerCustomOptions,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Blockplot-api')
    .setDescription('Fractional Real Estate')
    .addBearerAuth()
    .setVersion('1.0.0')
    .setContact(
      'Blockplot',
      'https://blockplot.org',
      'Support@blockplot.org',
    )
    .addTag('EndPoints')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const swaggerCustomOptions : SwaggerCustomOptions = {
    customSiteTitle: 'Blockplot Api',
    swaggerOptions: {
      persistAuthorization: true,
    }
  } 
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document, swaggerCustomOptions);

  app.enableCors()

  // app.useStaticAssets(join(__dirname, '..', 'public'))
  // app.setViewEngine('ejs')
  // app.setBaseViewsDir(join(__dirname, '..', 'views'))
  await app.listen(process.env.PORT || 4040);
}
bootstrap();
