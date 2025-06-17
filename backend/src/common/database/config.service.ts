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
      autoLoadEntities: true,
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      entities: [__dirname + '/entities/**/*{.ts,.js}'],
      synchronize: false,
    };
  }
}
