import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix("/api");
  let port = process.env.API_PORT || 3000;
  const config = new DocumentBuilder()
    .setTitle(
      "GENERAL TEST - POKE API & AWS RDS PG  - Luis Felipe Muñoz Flores"
    )
    .setDescription(
      "Mediante estos endpoints podrás probar el api con Swagger!"
    )
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  console.log("API LISTENING ON PORT ", port);
  await app.listen(port, "0.0.0.0");
}
bootstrap();
