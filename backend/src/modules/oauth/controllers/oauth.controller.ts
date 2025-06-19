import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '@modules/auth/permissions.guard';
import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard';
import { OauthLogicService } from '@modules/oauth/logic/oauth-logic.service';
import { LoginDTO } from '@modules/oauth/dtos/login.dto';

@Controller('oauth')
export class OauthController {
	constructor(private readonly oauthLogicService: OauthLogicService) {}

	@Get('guest')
	async guestToken() {
		return await this.oauthLogicService.guestToken();
	}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Post('login')
	async login(@Body() loginDTO: LoginDTO) {
		return await this.oauthLogicService.login(loginDTO);
	}
}
