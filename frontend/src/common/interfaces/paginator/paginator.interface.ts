export interface PaginationParams {
  page: number;
  limit: number;
  filters: string;
}

export interface PaginationDataResult {
  data: Array<any>;
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
}
