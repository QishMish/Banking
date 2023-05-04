interface PaginationProps {
  page: number;
  pageSize: number;
}

interface PaginationResult<T> extends PaginationProps {
  total: number;
  totalPages: number;
  data: T[];
}

type QueryResult<T> = {
  data: T[];
  total: number;
};

export { PaginationProps, PaginationResult, QueryResult };
