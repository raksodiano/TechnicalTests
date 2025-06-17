import { Injectable } from '@nestjs/common';
import { UsersDbService } from '@modules/users/db/users-db.service';
import { HashingService } from '@common/services/hashing.service';

@Injectable()
export class UsersLogicService {
	constructor(
		private readonly hashingService: HashingService,
		private usersDbService: UsersDbService,
	) {}
}
