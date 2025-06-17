import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { LoggerService } from '@common/logger/logger.service';
import {
	buildFilterConditions,
	parseFilters,
} from '@common/helpers/filter.helpers';
import { buildPaginationResponse } from '@common/helpers/pagination.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@entities/users/user.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class UsersDbService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		private readonly loggerService: LoggerService,
	) {}

	async create(createDto: any) {
		const user = this.userRepository.create(createDto);

		return await this.userRepository.save(user).catch((error) => {
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
			const [data, total] = await this.userRepository.findAndCount({
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

	async findOne(searchTerm: string): Promise<User> {
		return await this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.userInfo', 'userInfo')
			.where(
				isUUID(searchTerm)
					? 'user.id = :searchTerm'
					: 'user.email = :searchTerm',
				{ searchTerm },
			)
			.getOne()
			.catch((error) => {
				this.loggerService.error('Error al buscar el usuario:', error);
				throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
			});
	}

	async update(id: string, updateDto: any) {
		const user = await this.userRepository.preload({
			id,
			...updateDto,
		});

		if (user) {
			return this.userRepository.save(user).catch((error) => {
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
		const user = await this.userRepository.findOneBy({ id });

		if (user) {
			return this.userRepository.softRemove(user).catch((error) => {
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
