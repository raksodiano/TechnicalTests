import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardDbService } from '@modules/dashboard/db/dashboard-db.service';
import { DashboardController } from '@modules/dashboard/controllers/dashboard.controller';
import { DashboardEntity } from '@entities/dashboard/dashboard.entity';
import { UsersDbService } from '@modules/users/db/users-db.service';
import { User } from '@entities/users/user.entity';
import { DashboardLogicService } from '@modules/dashboard/logic/dashboard-logic.service';

@Module({
	imports: [TypeOrmModule.forFeature([DashboardEntity, User])],
	controllers: [DashboardController],
	providers: [DashboardDbService, DashboardLogicService, UsersDbService],
})
export class DashboardModule {}
