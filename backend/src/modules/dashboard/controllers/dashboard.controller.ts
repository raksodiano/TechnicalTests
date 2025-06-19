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
import { PermissionsGuard } from '@modules/auth/permissions.guard';
import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard';
import { PaginationDto } from '@common/dto/pagination.dto';
import { DashboardDbService } from '@modules/dashboard/db/dashboard-db.service';
import { DashboardEntity } from '@entities/dashboard/dashboard.entity';
import { UserId } from '@common/decorators/user-id.decorator';
import { DashboardLogicService } from '@modules/dashboard/logic/dashboard-logic.service';

@Controller('dashboard')
export class DashboardController {
	constructor(
		private readonly dashboardDbService: DashboardDbService,
		private readonly dashboardLogicService: DashboardLogicService,
	) {}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Post('create')
	async create(@UserId() userId: string, @Body() createDto: any) {
		return this.dashboardLogicService.create({ userId, ...createDto });
	}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Get('all')
	async findAll(@Query() paginationDto: PaginationDto) {
		return await this.dashboardDbService.findAll(paginationDto);
	}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Get('one/:searchTerm')
	async findOne(
		@Param('searchTerm') searchTerm: string,
	): Promise<DashboardEntity> {
		return this.dashboardDbService.findOne(searchTerm);
	}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Patch('update/:id')
	async update(@Param('id') id: string, @Body() updateDto: any) {
		return this.dashboardDbService.update(id, updateDto);
	}

	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Delete('delete/:id')
	async remove(@Param('id') id: string) {
		return this.dashboardDbService.remove(id);
	}
}
