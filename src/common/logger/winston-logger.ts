import { WinstonModule, utilities as nestWinstonModuleUtilities } from "nest-winston";
import * as winston from "winston";
import WinstonCloudwatch from "winston-cloudwatch";
import { TraceContext } from "./trace-context";

const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";

const traceIdFormat = winston.format((info) => {
  const traceId = TraceContext.getTraceId();
  if (traceId) {
    info.traceId = traceId;
  }
  return info;
});

const transports: winston.transport[] = [];
if (isDev) {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        traceIdFormat()
        //  nestWinstonModuleUtilities.format.nestLike('Frist Serve - Member Service', { prettyPrint: true }),
      ),
    })
  );
} else {
  // Remove colons from ISO string for AWS logStreamName compliance
  const safeStreamName = "AppStream-" + new Date().toISOString().replace(/:/g, "-");
  transports.push(
    new WinstonCloudwatch({
      logGroupName: "Cbus-Customer-Explorer-API",
      logStreamName: safeStreamName,
      awsRegion: "ap-southeast-2",
      jsonMessage: true,
    })
  );
}

export const winstonLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(traceIdFormat(), winston.format.timestamp(), winston.format.json()),
  transports,
});
