// src/index.ts
import "./instrument"; // Import at the very top
import * as Sentry from "@sentry/node";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { setupDocs } from "./middleware/docs";

// Load environment variables
dotenv.config();

const app = express();

// Basic middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setupDocs(app);

// Basic route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Test Sentry route
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// The error handler must be registered before any other error middleware
Sentry.setupExpressErrorHandler(app);

// Optional fallthrough error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // The error id is attached to `res.sentry` to be returned
    res.statusCode = 500;
    res.end((res as any).sentry + "\n");
  }
);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  Sentry.captureException(reason);
});
