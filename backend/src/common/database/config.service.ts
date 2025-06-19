import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DefaultTypeOrmConfigService implements TypeOrmOptionsFactory {
	constructor(private configService: ConfigService) {}

	createTypeOrmOptions(): TypeOrmModuleOptions {
		const configDatabase = this.configService.get('database');

		return {
			...configDatabase,
			autoLoadEntities: false,
			entities: ['dist/entities/**/*{.ts,.js}'],
			extra: {
				charset: 'utf8mb4_unicode_ci',
			},
		};
	}
}
