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
	@Post('create')
	async create(@Body() createDto: any) {
		return this.usersDbService.create(createDto);
	}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Get('all')
	async findAll(@Query() paginationDto: PaginationDto) {
		return await this.usersDbService.findAll(paginationDto);
	}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Get('one/:searchTerm')
	async findOne(@Param('searchTerm') searchTerm: string): Promise<User> {
		return this.usersDbService.findOne(searchTerm);
	}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Patch('update/:id')
	async update(@Param('id') id: string, @Body() updateDto: any) {
		return this.usersDbService.update(id, updateDto);
	}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Delete('delete/:id')
	async remove(@Param('id') id: string) {
		return this.usersDbService.remove(id);
	}
}
