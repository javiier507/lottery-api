export type Pagination<T> = {
  records: T;
  totalRecords: number;
};

export type PaginationParams = {
    limit: number;
    offset: number;
}
