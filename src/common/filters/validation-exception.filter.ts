import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from "@nestjs/common";
import { Response } from "express";

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const res: any = exception.getResponse();

    const messages = Array.isArray(res.message) ? res.message : [res.message];

    response.status(status).json({
      statusCode: status,
      error: "Validation Error",
      messages,
      timestamp: new Date().toISOString(),
      path: (request as any).url,
    });
  }
}
