import { db } from "@/db/drizzle";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const historyRouter = new Hono()
  .use("*", clerkMiddleware())
  .get("/", async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

    const historyRecords = await db.query.history.findMany({
      where: (record, { eq }) => eq(record.user_id, auth.userId),
    });

    return c.json({ records: historyRecords }, 200);
  })
  .post(
    "/",
    zValidator("json", z.object({ comments: z.string() })),
    async (c) => {
      const auth = getAuth(c);
      const data = c.req.valid("json");
      if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);
      return c.json({});
    },
  );
