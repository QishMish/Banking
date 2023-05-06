import { Injectable } from "@nestjs/common";
import { PaginationProps, PaginationResult, QueryResult } from "../types";

@Injectable()
export class PaginationService {
  public paginate<T>(
    queryResult: QueryResult<T>,
    options: PaginationProps
  ): PaginationResult<T> {
    const { data, total } = queryResult;
    const { page, pageSize } = options;
    const totalPages = Math.ceil(total / pageSize);

    return {
      page,
      pageSize,
      total,
      totalPages,
      data,
    };
  }

  public getPaginationProps = ({ page, pageSize }: PaginationProps) => ({
    skip: page === 1 ? 0 : (page - 1) * pageSize,
    limit: pageSize,
  });
}
