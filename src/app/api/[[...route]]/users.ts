import { Hono } from "hono";
import {
  getAuth,
  clerkMiddleware as clerkHonoMiddleware,
} from "@hono/clerk-auth";

import { zValidator } from "@hono/zod-validator";
import { insertUserSchema, users } from "@/db/schema";
import { db } from "@/db/drizzle";
import { clerkClient } from "@clerk/nextjs/server";

const userRouter = new Hono()
  .use("*", clerkHonoMiddleware())
  .get("/", async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);
    const currentUsers = await db.select().from(users);
    return c.json({ currentUsers });
  })
  .post(
    "/",
    zValidator("json", insertUserSchema.omit({ id: true })),
    async (c) => {
      const auth = getAuth(c);
      const client = await clerkClient();

      if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

      const data = c.req.valid("json");
      const currentRole = (await client.users.getUser(auth.userId))
        .publicMetadata.role;

      if (currentRole) return c.json({ error: "User already has role" }, 401);

      client.users.updateUserMetadata(auth.userId, {
        publicMetadata: { role: data.role },
      });
      const createdUser = await db
        .insert(users)
        .values({ ...data, id: auth.userId })
        .returning();

      return c.json(createdUser[0], 201);
    },
  );

export default userRouter;
