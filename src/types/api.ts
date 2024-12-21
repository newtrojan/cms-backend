// src/types/api.ts
export interface ErrorResponse {
  error: string;
  details?: any;
}

export interface SuccessResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
