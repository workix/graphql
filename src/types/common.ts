export interface PaginationArgs {
  first?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  totalCount: number;
  nodes: T[];
}

export interface GenericResponse {
  success: boolean;
  message: string;
}
