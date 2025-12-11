import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { map, Observable, tap } from "rxjs";
import { winstonLogger } from "../logger/winston-logger";
import { Request, Response } from "express";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const method = req?.method;
    const url = req.originalUrl || req?.url;
    const params = req?.params;
    const query = req?.query;
    const body = req?.body;

    winstonLogger.info("Incoming Request", {
      method,
      url: url,
      query,
      body: this.filterBody(body),
      params,
    });

    return next.handle().pipe(
      map((data) => {
        // Log the response body
        winstonLogger.info("Response Body", {
          method,
          url: url,
          responseBody: this.filterBody(data),
          jsonMessage: true,
        });
        return data;
      }),
      tap(() => {
        const time = Date.now() - now;
        winstonLogger.info("Request Completed", {
          method,
          url: url,
          statusCode: res.statusCode,
          durationMs: time,
        });
      })
    );
  }

  private filterBody(body: any) {
    const clone = { ...body };
    //I know the password and token are not applicable here but adding here just to
    //demonstrate filtering sensitive info from logs
    if (clone.password) clone.password = "[REDACTED]";
    if (clone.token) clone.token = "[REDACTED]";
    return clone;
  }
}
