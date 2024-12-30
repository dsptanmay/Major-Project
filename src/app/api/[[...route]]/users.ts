import { Hono } from "hono";
import {
  getAuth,
  clerkMiddleware as clerkHonoMiddleware,
} from "@hono/clerk-auth";

const userRouter = new Hono().use("*", clerkHonoMiddleware()).get("/", (c) => {
  return c.json({ hello: "world" });
});

export default userRouter;
