import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';
import { formatInTimeZone } from 'date-fns-tz';

@Injectable()
export class LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    // Build the logs directory path
    const logDirectory = path.join(__dirname, '..', '..', '..', 'logs');

    // Winston configuration with Daily Rotate File
    // const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
    //   filename: path.join(logDirectory, 'application-%DATE%.log'), // Use absolute path for log files
    //   datePattern: 'YYYY-MM-DD',
    //   zippedArchive: true, // Compress old log files
    //   maxSize: '20m', // Maximum file size
    //   maxFiles: '14d', // Keep logs for the last 14 days
    // });

    this.logger = winston.createLogger({
      level: 'info', // Default log level
      format: winston.format.combine(
        winston.format.timestamp({
          format: () =>
            formatInTimeZone(
              new Date(),
              'America/Lima',
              'yyyy-MM-dd HH:mm:ssXXX',
            ), // Use date-fns-tz to set the timezone
        }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const msg =
            typeof message === 'object'
              ? JSON.stringify(message, null, 2)
              : message;

          return `${timestamp} [${level.toUpperCase()}]: ${msg} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
        }),
      ),
      transports: [
        new winston.transports.Console(), // Also log to console
        // dailyRotateFileTransport, // Save to daily rotated files
      ],
    });
  }

  // Methods to log messages at different levels
  info(message: string | object) {
    this.logger.info(message);
  }

  warn(message: string | object) {
    this.logger.warn(message);
  }

  error(message: string | object, trace?: string) {
    this.logger.error(
      `${typeof message === 'object' ? JSON.stringify(message, null, 2) : message} - Trace: ${trace || 'No stack trace'}`,
    );
  }

  debug(message: string | object) {
    this.logger.debug(message);
  }

  verbose(message: string | object) {
    this.logger.verbose(message);
  }
}
