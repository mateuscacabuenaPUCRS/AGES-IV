export type PageableResponse<T> = {
  page: number;
  lastPage: number;
  total: number;
  data: T[];
};
