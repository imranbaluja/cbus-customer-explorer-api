import { Handler, Context, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { setupApp } from "./bootstrap-common";
import serverlessExpress from "@codegenie/serverless-express";

type ExpressHandler = (
  event: APIGatewayProxyEvent,
  context: Context,
  callback?: any
) => void | Promise<APIGatewayProxyResult>;

let cachedServer: ExpressHandler;

async function bootstrap(stage: string): Promise<ExpressHandler> {
  const app = await NestFactory.create(AppModule);

  await setupApp(app, stage, process.env.NODE_ENV !== "production");

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();

  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
  const stage = event.requestContext?.stage || "";

  if (!cachedServer) {
    cachedServer = await bootstrap(stage);
  }

  return cachedServer(event, context);
};
