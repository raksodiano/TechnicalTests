import { IsOptional, IsPositive, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
	@IsOptional()
	@IsPositive()
	@Transform(({ value }) => parseInt(value, 10))
	page: number = 1;

	@IsOptional()
	@IsPositive()
	@Transform(({ value }) => parseInt(value, 10))
	limit: number = 15;

	@IsOptional()
	@IsString()
	filters?: string;
}
