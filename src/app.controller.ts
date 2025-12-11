import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  health() {
    return "Welcome to Cbus-Customer Explorer API!";
  }
}
