/**
 * Interface for pagination results.
 * Represents the structure of the paginated response.
 */
export interface PaginationResult<T> {
	data: T[]; // Array of paginated data items
	total: number; // Total count of items in the database
	currentPage: number; // The current page number
	totalPages: number; // The total number of pages
	limit: number; // The limit of items per page
}

/**
 * Builds a paginated response structure.
 * @param data - The data array for the current page
 * @param total - The total number of items in the dataset
 * @param page - The current page number
 * @param limit - The number of items per page
 * @returns A structured object containing pagination information and data.
 */
export function buildPaginationResponse<T>(
	data: T[],
	total: number,
	page: number,
	limit: number,
): PaginationResult<T> {
	return {
		data,
		total,
		currentPage: page,
		totalPages: Math.ceil(total / limit),
		limit,
	};
}
