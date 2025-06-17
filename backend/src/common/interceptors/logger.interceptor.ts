import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  private readonly logger = new Logger(LoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, headers, params, query, body, ip } = request;
    const now = Date.now();

    if (url === '/favicon.ico' || method === 'OPTIONS') {
      return next.handle();
    }

    // Información detallada de la petición
    this.loggerService.info({
      method,
      url,
      ip,
      headers,
      params,
      query,
      body,
    });

    return next.handle().pipe(
      tap(() => {
        const elapsedTime = Date.now() - now;
        this.loggerService.info(
          `Request to ${method} ${url} completed in ${elapsedTime}ms`,
        );
      }),
      catchError((error) => {
        const elapsedTime = Date.now() - now;
        this.loggerService.error(
          `Request to ${method} ${url} failed in ${elapsedTime}ms - Error: ${error.message}
          Trace: ${error.stack}`,
        );
        return throwError(() => error);
      }),
    );
  }
}
