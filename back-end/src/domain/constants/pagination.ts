export interface PaginationParams {
  page: number;
  pageSize: number;
}

export class PaginatedEntity<T> {
  data: T[];
  page: number;
  lastPage: number;
  total: number;
}
