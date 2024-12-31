import { Hono } from "hono";
import {
  getAuth,
  clerkMiddleware as clerkHonoMiddleware,
} from "@hono/clerk-auth";

import { zValidator } from "@hono/zod-validator";
import { insertUserSchema, users } from "@/db/schema";
import { db } from "@/db/drizzle";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

const usersRouter = new Hono()
  .use("*", clerkHonoMiddleware())
  .get("/", async (c) => {
    // TODO: remove later
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);
    const currentUsers = await db.select().from(users);
    return c.json({ currentUsers });
  })
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);
      if (!id) return c.json({ error: "ID is required" }, 401);

      if (auth.userId !== id) return c.json({ error: "Incorrect ID" }, 401);
      try {
        const data = await db.query.users.findFirst({
          where: (user, { eq }) => eq(user.id, id),
        });
        if (!data) return c.json({ error: "User not found" }, 404);
        return c.json({ data });
      } catch (error) {
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  )
  .post(
    "/",
    zValidator("json", insertUserSchema.omit({ id: true, created_at: true })),
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

export default usersRouter;
