import { INestApplication, ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { CacheControlInterceptor } from "./common/interceptors/cache-control.interceptor";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { ValidationExceptionFilter } from "./common/filters/validation-exception.filter";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

export async function setupApp(app: INestApplication, stage: string, enableSwagger = true) {
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  let prefix = stage ? "/" + process.env.ENV_SHORT + "-" + process.env.SERVICE_NAME : "";
  if (enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle("Customer Explorer API")
      .setDescription("Customer Explorer API description")
      .setVersion("1.0")
      .addServer(prefix)
      .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup("docs", app, document, {
      customSiteTitle: "Customer Explorer API",
      customJs: [
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
      ],
      customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css",
      swaggerOptions: {
        persistAuthorization: true,
        validatorUrl: null,
      },
    });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  app.useGlobalInterceptors(new LoggingInterceptor(), new CacheControlInterceptor());
  app.useGlobalFilters(new ValidationExceptionFilter(), new HttpExceptionFilter(), new AllExceptionsFilter());
}
