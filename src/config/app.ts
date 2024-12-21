// src/config/app.ts
import dotenv from "dotenv";

dotenv.config();

export const config = {
  app: {
    name: "CMS Backend",
    port: process.env.PORT || 5001,
    env: process.env.NODE_ENV || "development",
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  database: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
  },
};
