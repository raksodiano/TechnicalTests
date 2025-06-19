import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { DefaultTypeOrmConfigService } from '@common/database/config.service';
import { LoggerService } from '@common/logger/logger.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from '@common/interceptors/logger.interceptor';
import { OauthModule } from '@modules/oauth/oauth.module';
import { UsersModule } from '@modules/users/users.module';
import { LoggerModule } from '@common/logger/logger.module';
import { AuthModule } from '@modules/auth/auth.module';
import { DashboardModule } from '@modules/dashboard/dashboard.module';

@Module({
	imports: [
		LoggerModule,
		AuthModule,
		OauthModule,
		UsersModule,
		DashboardModule,
		ConfigModule.forRoot({
			load: [configuration],
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useClass: DefaultTypeOrmConfigService,
		}),
	],
	controllers: [AppController],
	providers: [
		AppService,
		LoggerService,
		{ provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
	],
})
export class AppModule {}
