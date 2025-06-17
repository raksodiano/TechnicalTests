import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OauthLogicService } from '@modules/oauth/logic/oauth-logic.service';
import { OauthController } from '@modules/oauth/controllers/oauth.controller';
import { HashingService } from '@common/services/hashing.service';
import { UsersDbService } from '@modules/users/db/users-db.service';
import { User } from '@entities/users/user.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.getOrThrow<string>('jwt.secret'),
				signOptions: {
					expiresIn: parseInt(configService.getOrThrow<string>('jwt.expire')),
				},
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [OauthController],
	providers: [HashingService, OauthLogicService, UsersDbService],
})
export class OauthModule {}
