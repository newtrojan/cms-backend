// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import * as Sentry from "@sentry/node";
import { config } from "../config/app";
import { AppError } from "../utils/errors";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  console.error(error);

  // Capture error in Sentry
  Sentry.captureException(error);

  // Check if error is operational
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      ...(config.app.env === "development" && { stack: error.stack }),
    });
  }

  // Handle unexpected errors
  return res.status(500).json({
    status: "error",
    message: "Something went wrong!",
    ...(config.app.env === "development" && { stack: error.stack }),
    ...(res.sentry ? { sentryEventId: res.sentry } : {}),
  });
};
