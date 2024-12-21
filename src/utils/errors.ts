// src/utils/errors.ts
import * as Sentry from "@sentry/node";

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (error: Error) => {
  Sentry.captureException(error);

  if (process.env.NODE_ENV === "development") {
    console.error("Error:", error);
  }
};
