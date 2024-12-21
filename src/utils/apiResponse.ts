// src/utils/apiResponse.ts
import { Response } from "express";
import {
  SuccessResponse,
  ErrorResponse,
  PaginatedResponse,
} from "../types/api";

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode = 200
  ): Response {
    const response: SuccessResponse<T> = {
      data,
      message,
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    error: string,
    statusCode = 500,
    details?: any
  ): Response {
    const response: ErrorResponse = {
      error,
      details,
    };
    return res.status(statusCode).json(response);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    total: number,
    page: number,
    limit: number
  ): Response {
    const response: PaginatedResponse<T> = {
      data,
      total,
      page,
      limit,
    };
    return res.status(200).json(response);
  }
}
