// src/index.ts
import "./instrument"; // Must be first import
import * as Sentry from "@sentry/node";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config/app";
import { setupDocs } from "./middleware/docs";
import authRoutes from "./routes/auth";

const app = express();

// Basic middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup API documentation
setupDocs(app);

// Routes
app.use("/auth", authRoutes);

// Basic health check route
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date(),
    environment: config.app.env,
  });
});

// Test Sentry
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

// Optional fallthrough error handler
app.use(function onError(
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // The error id is attached to res.sentry to be returned
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

// Start server
const server = app.listen(config.app.port, () => {
  console.log(
    `🚀 Server running on port ${config.app.port} in ${config.app.env} mode`
  );
});

export default server;
