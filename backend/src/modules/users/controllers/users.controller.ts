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
import { UsersDbService } from '../db/users-db.service';
import { PermissionsGuard } from '@modules/auth/permissions.guard';
import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard';
import { User } from '@entities/users/user.entity';
import { PaginationDto } from '@common/dto/pagination.dto';

@Controller('users')
export class UsersController {
	constructor(private readonly usersDbService: UsersDbService) {}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Post()
	async create(@Body() createUserDto: any) {
		return this.usersDbService.create(createUserDto);
	}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Get()
	async findAll(@Query() paginationDto: PaginationDto) {
		return await this.usersDbService.findAll(paginationDto);
	}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Get(':searchTerm')
	async findOne(@Param('searchTerm') searchTerm: string): Promise<User> {
		return this.usersDbService.findOne(searchTerm);
	}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Patch(':id')
	async update(@Param('id') id: string, @Body() updateUserDto: any) {
		return this.usersDbService.update(id, updateUserDto);
	}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Delete(':id')
	async remove(@Param('id') id: string) {
		return this.usersDbService.remove(id);
	}
}
