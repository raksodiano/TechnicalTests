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
import { UserInformation } from '@entities/users/user-info.entity';

@Injectable()
export class UsersInformationDbService {
	constructor(
		@InjectRepository(UserInformation)
		private readonly userInformationRepository: Repository<UserInformation>,
		private readonly loggerService: LoggerService,
	) {}

	async create(createDto: any) {
		const user = this.userInformationRepository.create(createDto);

		return await this.userInformationRepository.save(user).catch((error) => {
			this.loggerService.error('Error al crear el usuario:', error);
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
			const [data, total] = await this.userInformationRepository.findAndCount({
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
			this.loggerService.error('Error al buscar los usuarios:', error);
			throw new HttpException(
				'Error al buscar los usuarios',
				HttpStatus.UNPROCESSABLE_ENTITY,
			);
		}
	}

	async findOne(searchTerm: string): Promise<UserInformation> {
		return await this.userInformationRepository
			.createQueryBuilder('userInfo')
			.where('user.id = :searchTerm', { searchTerm })
			.getOne()
			.catch((error) => {
				this.loggerService.error('Error al buscar el usuario:', error);
				throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
			});
	}

	async update(id: string, updateDto: any) {
		const user = await this.userInformationRepository.preload({
			id,
			...updateDto,
		});

		if (user) {
			return this.userInformationRepository.save(user).catch((error) => {
				this.loggerService.error('Error al actualizar el usuario:', error);
				throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
			});
		}

		this.loggerService.error('No se encontró el usuario');
		throw new HttpException(
			'No se encontró el usuario',
			HttpStatus.UNPROCESSABLE_ENTITY,
		);
	}

	async remove(id: string) {
		const user = await this.userInformationRepository.findOneBy({ id });

		if (user) {
			return this.userInformationRepository.softRemove(user).catch((error) => {
				this.loggerService.error('Error al eliminar el usuario:', error);
				throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
			});
		}

		this.loggerService.error('No se encontró el usuario');
		throw new HttpException(
			'No se encontró el usuario',
			HttpStatus.UNPROCESSABLE_ENTITY,
		);
	}
}
