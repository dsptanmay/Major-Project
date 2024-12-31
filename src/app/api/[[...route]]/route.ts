import { Hono } from "hono";
import { logger } from "hono/logger";
import { handle } from "hono/vercel";

import userRouter from "./users";
import medicalRecordsRouter from "./medical-records";

export const runtime = "nodejs";

const app = new Hono().basePath("/api").use("*", logger());

const routes = app
  .route("/users", userRouter)
  .route("/medical_records", medicalRecordsRouter);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
