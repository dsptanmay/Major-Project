import { db } from "@/db/drizzle";
import { history, insertHistorySchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
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
  .get("/write", async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

    const writeEvents = await db
      .select({
        id: history.id,
        transaction_hash: history.transaction_hash,
        description: history.comments,
        performed_at: history.performed_at,
      })
      .from(history)
      .where(
        and(eq(history.user_id, auth.userId), eq(history.event_type, "write")),
      );

    if (!writeEvents.length)
      return c.json({ error: "No write events found for user!" }, 404);

    return c.json(writeEvents, 200);
  })
  .get("/read", async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

    const readEvents = await db
      .select({
        id: history.id,
        description: history.comments,
        performed_at: history.performed_at,
      })
      .from(history)
      .where(
        and(eq(history.user_id, auth.userId), eq(history.event_type, "read")),
      );

    if (!readEvents.length)
      return c.json({ error: "No write events found for user!" }, 404);

    return c.json(readEvents, 200);
  });

export default historyRouter;
