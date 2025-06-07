export interface Pagination<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
