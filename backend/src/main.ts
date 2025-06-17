import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { TimezoneInterceptor } from '@common/interceptors/timezone.interceptor';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors();

	const configService = app.get(ConfigService);
	const PORT = configService.get<number>('port');

	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.setGlobalPrefix('api/v1');

	app.useGlobalInterceptors(
		new TimezoneInterceptor(),
		new TimezoneInterceptor(),
	);

	await app.listen(PORT);
}

bootstrap();
