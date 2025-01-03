import { Hono } from "hono";
import { logger } from "hono/logger";
import { handle } from "hono/vercel";

import usersRouter from "./users";
import notificationsRouter from "./notifications";
import medicalRecordsRouter from "./medical-records";
import accessRequestsRouter from "./access-requests";

// export const runtime = "edge";

const app = new Hono().basePath("/api").use("*", logger());

const routes = app
  .route("/users", usersRouter)
  .route("/notifications", notificationsRouter)
  .route("/medical_records", medicalRecordsRouter)
  .route("/access_requests", accessRequestsRouter);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
