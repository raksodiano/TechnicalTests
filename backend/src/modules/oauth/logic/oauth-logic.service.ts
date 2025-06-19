import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersDbService } from '@modules/users/db/users-db.service';
import { HashingService } from '@common/services/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from '@modules/oauth/dtos/login.dto';

@Injectable()
export class OauthLogicService {
	constructor(
		private readonly hashingService: HashingService,
		private jwtService: JwtService,
		private usersDbService: UsersDbService,
	) {}

	async guestToken() {
		return {
			access_token: await this.jwtService.signAsync({
				permissions: [],
				user_id: '',
			}),
		};
	}

	async login(loginDTO: LoginDTO) {
		const { email } = loginDTO;

		const user = await this.usersDbService.findOne(email);

		if (!user) {
			throw new HttpException(
				'Correo electrónico no registrado.',
				HttpStatus.NOT_FOUND,
			);
		}

		const passwordValidation = await this.hashingService.comparePassword(
			loginDTO.password,
			user?.password,
		);

		if (!passwordValidation) {
			throw new HttpException(
				'La contraseña es incorrecta.',
				HttpStatus.BAD_REQUEST,
			);
		}

		return {
			access_token: await this.jwtService.signAsync({
				permissions: [],
				user_id: user.id,
			}),
			user,
		};
	}
}
