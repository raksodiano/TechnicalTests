import { Injectable } from '@nestjs/common';
import { DashboardDbService } from '@modules/dashboard/db/dashboard-db.service';
import { UsersDbService } from '@modules/users/db/users-db.service';

@Injectable()
export class DashboardLogicService {
	constructor(
		private dashboardDbService: DashboardDbService,
		private usersDbService: UsersDbService,
	) {}

	async create(createDto: any) {
		const user = await this.usersDbService.findOne(createDto?.userId);

		const changeStatus = (user?.dashboards || []).map(({ id }) => ({
			id,
			status: 'DISABLED',
		}));

		await this.dashboardDbService.bulk(changeStatus);

		return await this.dashboardDbService.create(createDto);
	}
}
