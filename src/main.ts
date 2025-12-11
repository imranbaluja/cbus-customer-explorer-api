import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { setupApp } from "./bootstrap-common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await setupApp(app, "");
  const configService = app.get(ConfigService);
  await app.listen(configService.get("PORT") || 3001);
}
bootstrap();
