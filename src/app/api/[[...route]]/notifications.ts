import { clerkMiddleware } from "@hono/clerk-auth";
import { Hono } from "hono";

const notificationsRouter = new Hono().use("*", clerkMiddleware());

export default notificationsRouter;
