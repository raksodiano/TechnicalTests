import { HttpException, HttpStatus } from '@nestjs/common';
import {
	Brackets,
	FindOptionsWhere,
	In,
	IsNull,
	Like,
	Not,
	Raw,
	SelectQueryBuilder,
} from 'typeorm';

/**
 * Valida y parsea los filtros enviados como cadena JSON en los parámetros de la query.
 * @param filters Filtros en formato JSON en cadena de texto.
 * @returns Filtros parseados como objeto.
 * @throws HttpException Si los filtros no son un objeto JSON válido.
 */
export function parseFilters(filters: string | object): object {
	if (typeof filters === 'string') {
		try {
			// Intentamos parsear el string JSON a un objeto
			return JSON.parse(filters);
		} catch (error) {
			// Si el JSON es inválido, lanzamos un error adecuado
			throw new HttpException(
				'El formato de los filtros no es válido. Asegúrate de enviarlo como un objeto JSON.',
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	if (typeof filters === 'object') {
		return filters;
	}

	// Si no es un string ni un objeto, lanzamos un error
	throw new HttpException(
		'Los filtros deben ser un objeto o un string JSON válido.',
		HttpStatus.BAD_REQUEST,
	);
}

/**
 * Construye condiciones de filtro compatibles con `find` de TypeORM.
 *
 * @param filters - Arreglo o objeto que define las condiciones de filtro.
 * @returns Condiciones en formato `FindOptionsWhere` para TypeORM.
 */
export function buildFilterConditions(
	filters: any[] | any,
): FindOptionsWhere<any> {
	// Caso: Filtros individuales como objeto
	if (!Array.isArray(filters)) filters = [filters];

	const where: FindOptionsWhere<any>[] = [];

	filters.forEach((filter) => {
		if ('conditions' in filter && Array.isArray(filter.conditions)) {
			// Caso: Grupo de condiciones con un operador lógico
			const subConditions = buildFilterConditions(filter.conditions);
			where.push({ [`$${filter.operator?.toUpperCase()}`]: subConditions });
		} else {
			// Caso: Filtro simple
			const { field, value, operator } = filter;

			switch (operator?.toUpperCase()) {
				case '=':
					where.push({ [field]: value });
					break;
				case '!=':
					where.push({ [field]: Not(value) });
					break;
				case 'LIKE':
					where.push({ [field]: Like(`%${value}%`) });
					break;
				case 'NOT LIKE':
					where.push({ [field]: Not(Like(`%${value}%`)) });
					break;
				case 'IN':
					where.push({ [field]: In(value) });
					break;
				case 'NOT IN':
					where.push({ [field]: Not(In(value)) });
					break;
				case 'IS NULL':
					where.push({ [field]: IsNull() });
					break;
				case 'IS NOT NULL':
					where.push({ [field]: Not(IsNull()) });
					break;
				case '>=':
					where.push({
						[field]: Raw((alias) => `${alias} >= :value`, { value }),
					});
					break;
				case '<=':
					where.push({
						[field]: Raw((alias) => `${alias} <= :value`, { value }),
					});
					break;
				case 'BETWEEN':
					if (!Array.isArray(value) || value.length !== 2) {
						throw new Error(
							'Value for BETWEEN operator must be an array of two elements',
						);
					}
					where.push({
						[field]: Raw((alias) => `${alias} BETWEEN :start AND :end`, {
							start: value[0],
							end: value[1],
						}),
					});
					break;
				case 'NOT BETWEEN':
					if (!Array.isArray(value) || value.length !== 2) {
						throw new Error(
							'Value for NOT BETWEEN operator must be an array of two elements',
						);
					}
					where.push({
						[field]: Raw((alias) => `${alias} NOT BETWEEN :start AND :end`, {
							start: value[0],
							end: value[1],
						}),
					});
					break;
				default:
					throw new Error(`Unsupported operator: ${operator}`);
			}
		}
	});

	return where.length === 1 ? where[0] : { $and: where };
}

/**
 * Aplica condiciones de filtro al `QueryBuilder` de TypeORM.
 *
 * @param queryBuilder - Instancia del `QueryBuilder` donde se aplicarán los filtros.
 * @param filters - Arreglo o objeto que define las condiciones de filtro.
 * @param operator - Operador lógico que se utiliza para combinar las condiciones ("AND" o "OR").
 * @returns El mismo `QueryBuilder` con los filtros aplicados.
 */
export function applyFilterConditions<T>(
	queryBuilder: SelectQueryBuilder<T>,
	filters: any[] | any,
	operator: 'AND' | 'OR' = 'AND',
): SelectQueryBuilder<T> {
	// Si los filtros siguen llegando como un string, los parseamos usando parseFilters
	if (typeof filters === 'string') filters = parseFilters(filters);

	// Si los filtros no son un arreglo, los convertimos en uno
	if (!Array.isArray(filters)) filters = [filters];

	// Iterar sobre cada filtro
	filters.forEach((filter: any) => {
		// Verificar si el filtro es un grupo lógico con condiciones anidadas
		if ('conditions' in filter && Array.isArray(filter.conditions)) {
			// Si tiene condiciones, usamos el operador lógico correspondiente (AND/OR)
			const subOperator =
				filter.operator?.toUpperCase() === 'OR' ? 'OR' : 'AND';

			// Aplicamos las condiciones anidadas
			queryBuilder[operator === 'AND' ? 'andWhere' : 'orWhere'](
				new Brackets((qb) => {
					// Se ignoran advertencias de TypeScript porque los tipos ya se manejan en niveles superiores
					// @ts-ignore
					applyFilterConditions(qb, filter.conditions, subOperator);
				}),
			);
		} else if ('field' in filter && 'value' in filter) {
			// Caso: Filtro simple con "field" y "value" (sin operador lógico ni anidación)
			const { field, value, operator: conditionOperator } = filter;

			let queryCondition = '';
			let parameters: Record<string, any> = {};

			const paramName = field.replace('.', '_');

			// Determinar el tipo de condición
			switch (conditionOperator?.toUpperCase()) {
				case '=':
					queryCondition = `${field} = :${paramName}Value`;
					parameters = { [`${paramName}Value`]: value };
					break;
				case '!=':
					queryCondition = `${field} != :${paramName}Value`;
					parameters = { [`${paramName}Value`]: value };
					break;
				case 'LIKE':
					queryCondition = `${field} LIKE :${paramName}Value`;
					parameters = { [`${paramName}Value`]: `%${value}%` };
					break;
				case 'NOT LIKE':
					queryCondition = `${field} NOT LIKE :${paramName}Value`;
					parameters = { [`${paramName}Value`]: `%${value}%` };
					break;
				case 'IN':
					queryCondition = `${field} IN (:...${paramName}Values)`;
					parameters = { [`${paramName}Values`]: value };
					break;
				case 'NOT IN':
					queryCondition = `${field} NOT IN (:...${paramName}Values)`;
					parameters = { [`${paramName}Values`]: value };
					break;
				case 'IS NULL':
					queryCondition = `${field} IS NULL`;
					break;
				case 'IS NOT NULL':
					queryCondition = `${field} IS NOT NULL`;
					break;
				case '>=':
					queryCondition = `${field} >= :${paramName}Value`;
					parameters = { [`${paramName}Value`]: value };
					break;
				case '<=':
					queryCondition = `${field} <= :${paramName}Value`;
					parameters = { [`${paramName}Value`]: value };
					break;
				case 'BETWEEN':
					if (!Array.isArray(value) || value.length !== 2) {
						throw new Error(
							'Value for BETWEEN operator must be an array of two elements',
						);
					}
					queryCondition = `${field} BETWEEN :${paramName}Start AND :${paramName}End`;
					parameters = {
						[`${paramName}Start`]: value[0],
						[`${paramName}End`]: value[1],
					};
					break;
				case 'NOT BETWEEN':
					if (!Array.isArray(value) || value.length !== 2) {
						throw new Error(
							'Value for NOT BETWEEN operator must be an array of two elements',
						);
					}
					queryCondition = `${field} NOT BETWEEN :${paramName}Start AND :${paramName}End`;
					parameters = {
						[`${paramName}Start`]: value[0],
						[`${paramName}End`]: value[1],
					};
					break;
				default:
					throw new Error(`Unsupported operator: ${conditionOperator}`);
			}

			// Agregar condición simple
			queryBuilder[operator === 'AND' ? 'andWhere' : 'orWhere'](
				queryCondition,
				parameters,
			);
		} else {
			// Si no se encuentra el campo `field`, lanzar un error
			throw new Error('Filtro inválido. Debe contener "field" y "value".');
		}
	});

	return queryBuilder;
}
