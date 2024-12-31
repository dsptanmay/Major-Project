import {
  clerkMiddleware as clerkHonoMiddleware,
  getAuth,
} from "@hono/clerk-auth";
import { Hono } from "hono";

const accessRequestsRouter = new Hono()
  .use("*", clerkHonoMiddleware())
  .get("/", async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);
    return c.json({});
  });

export default accessRequestsRouter;
