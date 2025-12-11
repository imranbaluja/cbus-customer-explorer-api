import { Module, NestModule } from "@nestjs/common";
import { CustomerModule } from "./customer/customer.module";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    CustomerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot({
      transports: [new winston.transports.Console()],
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
