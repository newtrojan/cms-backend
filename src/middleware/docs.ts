// src/middleware/docs.ts
import { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { specs } from "../config/swagger";

export const setupDocs = (app: Express) => {
  // Swagger documentation route
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

  // JSON version of documentation
  app.get("/api-docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });
};
