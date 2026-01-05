import { AppModule } from "@infra/modules/app/app.module";
import { HttpStatus, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    })
  );

  const config = new DocumentBuilder()
    .setTitle("Pão dos Pobres API")
    .setDescription("API da plataforma de doação do Pão dos Pobres")
    .setVersion("1.0")
    .addSecurity("bearerAuth", {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT"
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    "/docs",
    apiReference({
      theme: "dark",
      darkMode: true,
      layout: "modern",
      spec: {
        content: document
      }
    })
  );

  await app.listen(process.env.PORT ?? 3000);

  console.info(`Server is running on port ${process.env.PORT ?? 3000}`);

  console.info(`Docs: http://localhost:${process.env.PORT ?? 3000}/docs`);
}
bootstrap();
