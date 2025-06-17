import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { UsersInformationDbService } from '../db/users-information-db.service';
import { PermissionsGuard } from '@modules/auth/permissions.guard';
import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard';
import { UserInformation } from '@entities/users/user-info.entity';
import { PaginationDto } from '@common/dto/pagination.dto';

@Controller('users/information')
export class UsersInformationController {
	constructor(
		private readonly usersInformationDbService: UsersInformationDbService,
	) {}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Post()
	async create(@Body() createUserDto: any) {
		return this.usersInformationDbService.create(createUserDto);
	}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Get()
	async findAll(@Query() paginationDto: PaginationDto) {
		return await this.usersInformationDbService.findAll(paginationDto);
	}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Get(':searchTerm')
	async findOne(
		@Param('searchTerm') searchTerm: string,
	): Promise<UserInformation> {
		return this.usersInformationDbService.findOne(searchTerm);
	}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Patch(':id')
	async update(@Param('id') id: string, @Body() updateUserDto: any) {
		return this.usersInformationDbService.update(id, updateUserDto);
	}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Delete(':id')
	async remove(@Param('id') id: string) {
		return this.usersInformationDbService.remove(id);
	}
}
