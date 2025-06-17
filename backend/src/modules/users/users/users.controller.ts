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
import { UsersService } from './users.service';
import { PermissionsGuard } from '@modules/auth/permissions.guard';
import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard';
import { User } from '@entities/users/user.entity';
import { PaginationDto } from '@common/dto/pagination.dto';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Post()
	async create(@Body() createUserDto: any) {
		return this.usersService.create(createUserDto);
	}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Get()
	async findAll(@Query() paginationDto: PaginationDto) {
		return await this.usersService.findAll(paginationDto);
	}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Get(':searchTerm')
	async findOne(@Param('searchTerm') searchTerm: string): Promise<User> {
		return this.usersService.findOne(searchTerm);
	}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Patch(':id')
	async update(@Param('id') id: string, @Body() updateUserDto: any) {
		return this.usersService.update(id, updateUserDto);
	}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Delete(':id')
	async remove(@Param('id') id: string) {
		return this.usersService.remove(id);
	}
}
