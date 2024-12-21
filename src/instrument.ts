import { dotenv } from "dotenv";
// src/instrument.ts
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: process.env.SENTRY_DSN, // Replace with your actual DSN
  integrations: [nodeProfilingIntegration()],
  // Performance Monitoring
  tracesSampleRate: 1.0,
});

// Optional: Start profiler
Sentry.profiler.startProfiler();

// Optional: Create a test transaction
Sentry.startSpan(
  {
    name: "Application Startup",
  },
  () => {
    // Application startup logic here
  }
);

export { Sentry };
