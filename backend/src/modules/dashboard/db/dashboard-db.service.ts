import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoggerService } from '@common/logger/logger.service';
import {
	buildFilterConditions,
	parseFilters,
} from '@common/helpers/filter.helpers';
import { buildPaginationResponse } from '@common/helpers/pagination.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '@common/dto/pagination.dto';
import { DashboardEntity } from '@entities/dashboard/dashboard.entity';

@Injectable()
export class DashboardDbService {
	constructor(
		@InjectRepository(DashboardEntity)
		private readonly dashboardRepository: Repository<DashboardEntity>,
		private readonly loggerService: LoggerService,
	) {}

	async create(createDto: any) {
		const dashboard = this.dashboardRepository.create(createDto);

		return await this.dashboardRepository.save(dashboard).catch((error) => {
			this.loggerService.error('Error al crear el dashboard:', error);
			throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
		});
	}

	async findAll(paginationDto: PaginationDto) {
		const { page, limit, filters } = paginationDto;

		const parsedFilters = filters ? parseFilters(filters) : {};

		const where =
			Object.keys(parsedFilters).length > 0
				? buildFilterConditions(parsedFilters)
				: {};

		try {
			const [data, total] = await this.dashboardRepository.findAndCount({
				where,
				skip: (page - 1) * limit,
				take: limit,
				relations: [],
				order: {
					createdAt: 'DESC',
				},
			});

			return buildPaginationResponse(data, total, page, limit);
		} catch (error) {
			this.loggerService.error('Error al buscar los dashboards:', error);
			throw new HttpException(
				'Error al buscar los dashboards',
				HttpStatus.UNPROCESSABLE_ENTITY,
			);
		}
	}

	async findOne(searchTerm: string): Promise<DashboardEntity> {
		return await this.dashboardRepository
			.createQueryBuilder('dashboard')
			.where('dashboard.id = :searchTerm', { searchTerm })
			.getOne()
			.catch((error) => {
				this.loggerService.error('Error al buscar el dashboard:', error);
				throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
			});
	}

	async update(id: string, updateDto: any) {
		const dashboard = await this.dashboardRepository.preload({
			id,
			...updateDto,
		});

		if (dashboard) {
			return this.dashboardRepository.save(dashboard).catch((error) => {
				this.loggerService.error('Error al actualizar el dashboard:', error);
				throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
			});
		}

		this.loggerService.error('No se encontró el dashboard');
		throw new HttpException(
			'No se encontró el dashboard',
			HttpStatus.UNPROCESSABLE_ENTITY,
		);
	}

	async remove(id: string) {
		const dashboard = await this.dashboardRepository.findOneBy({ id });

		if (dashboard) {
			return this.dashboardRepository.softRemove(dashboard).catch((error) => {
				this.loggerService.error('Error al eliminar el dashboard:', error);
				throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
			});
		}

		this.loggerService.error('No se encontró el dashboard');
		throw new HttpException(
			'No se encontró el dashboard',
			HttpStatus.UNPROCESSABLE_ENTITY,
		);
	}

	async bulk(bulkDto: any[]) {
		return this.dashboardRepository.save(bulkDto).catch((error) => {
			this.loggerService.error('Error al crear el dashboard:', error);
			throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
		});
	}
}
