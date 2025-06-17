import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { format, toZonedTime } from 'date-fns-tz';

@Injectable()
export class TimezoneInterceptor implements NestInterceptor {
	private readonly timeZone: string;

	constructor() {
		this.timeZone = 'America/Lima';
	}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			map((data) => {
				return this.adjustDates(data);
			}),
		);
	}

	private adjustDates(data: any): any {
		if (data instanceof Date) {
			return this.formatDate(data);
		} else if (Array.isArray(data)) {
			return data.map((item) => this.adjustDates(item));
		} else if (data && typeof data === 'object') {
			for (const key in data) {
				if (data.hasOwnProperty(key)) {
					if (data[key] instanceof Date) {
						data[key] = this.formatDate(data[key]);
					} else {
						data[key] = this.adjustDates(data[key]);
					}
				}
			}
			return data;
		}
		return data;
	}

	private formatDate(date: Date): string {
		const localDate = toZonedTime(date, this.timeZone);
		return format(localDate, 'yyyy-MM-dd HH:mm:ssXXX', {
			timeZone: this.timeZone,
		});
	}
}
