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
      )
      .limit(10);

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
      )
      .limit(10);

    return c.json(readEvents, 200);
  })
  .get("/write/all", async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

    const data = await db
      .select({
        id: history.id,
        description: history.comments,
        transaction_hash: history.transaction_hash,
        performed_at: history.performed_at,
      })
      .from(history)
      .where(eq(history.user_id, auth.userId));

    return c.json(data, 200);
  })
  .get("/read/all", async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

    const data = await db
      .select({
        id: history.id,
        description: history.comments,
        performed_at: history.performed_at,
      })
      .from(history)
      .where(eq(history.user_id, auth.userId));

    return c.json(data, 200);
  })
  .post("/write", zValidator("json", insertHistorySchema), async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

    const data = c.req.valid("json");

    const [newEvent] = await db
      .insert(history)
      .values({
        event_type: "write",
        comments: data.comments,
        transaction_hash: data.transaction_hash,
        user_id: auth.userId,
      })
      .returning();

    if (!newEvent)
      return c.json({ error: "Failed to create write event!" }, 500);

    return c.json(newEvent, 201);
  })
  .post("/read", zValidator("json", insertHistorySchema), async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

    const data = c.req.valid("json");

    const [newEvent] = await db
      .insert(history)
      .values({
        event_type: "read",
        comments: data.comments,
        user_id: auth.userId,
      })
      .returning();

    if (!newEvent)
      return c.json({ error: "Failed to create read event!" }, 500);

    return c.json(newEvent, 201);
  });

export default historyRouter;
