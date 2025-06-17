import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HashingService {
	private readonly saltRounds = 10;

	async hashPassword(plainPassword: string): Promise<string> {
		const salt = await bcrypt.genSalt(this.saltRounds);
		return bcrypt.hash(plainPassword, salt);
	}

	async comparePassword(
		plainPassword: string,
		hashedPassword: string,
	): Promise<boolean> {
		return bcrypt.compare(plainPassword, hashedPassword);
	}
}
