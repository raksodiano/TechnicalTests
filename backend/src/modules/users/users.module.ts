import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersDbService } from './db/users-db.service';
import { UsersController } from './controllers/users.controller';
import { User } from '@entities/users/user.entity';
import { UsersInformationDbService } from '@modules/users/db/users-information-db.service';
import { UserInformation } from '@entities/users/user-info.entity';
import { UsersInformationController } from '@modules/users/controllers/users-information.controller';
import { UsersLogicService } from '@modules/users/logic/users-logic.service';
import { HashingService } from '@common/services/hashing.service';

@Module({
	imports: [TypeOrmModule.forFeature([User, UserInformation])],
	controllers: [UsersController, UsersInformationController],
	providers: [
		HashingService,
		UsersDbService,
		UsersInformationDbService,
		UsersLogicService,
	],
})
export class UsersModule {}
