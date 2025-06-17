import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest();
		const statusCode = context.switchToHttp().getResponse().statusCode;
		return next.handle().pipe(
			map((res) => ({
				statusCode,
				path: request.url,
				data: res,
				error: null,
			})),
		);
	}
}
