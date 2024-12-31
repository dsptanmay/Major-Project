import { db } from "@/db/drizzle";
import { and, eq } from "drizzle-orm";
import { medicalRecords, notifications, users } from "@/db/schema";

import { USER_ROLE } from "@/types/roles";

import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import {
  clerkMiddleware as clerkHonoMiddleware,
  getAuth,
} from "@hono/clerk-auth";
import { Hono } from "hono";

const notificationsRouter = new Hono()
  .use("*", clerkHonoMiddleware())
  .get("/user", async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

    const userData = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.id, auth.userId),
      columns: {
        role: true,
      },
    });

    if (!userData) return c.json({ error: "User not found" }, 404);
    if (userData.role !== "user") return c.json({ error: "Invalid role" }, 400);

    const result = await db
      .select({
        id: notifications.id,
        message: notifications.message,
        token_id: medicalRecords.token_id,
        org_username: users.username,
        org_wallet_address: users.wallet_address,
      })
      .from(notifications)
      .innerJoin(medicalRecords, eq(notifications.record_id, medicalRecords.id))
      .innerJoin(users, eq(notifications.org_id, users.id))
      .where(
        and(
          eq(notifications.user_id, auth.userId),
          eq(notifications.status, "pending"),
        ),
      );

    return c.json({ data: result });
  })
  .get("/org", async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

    const userData = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.id, auth.userId),
      columns: {
        role: true,
      },
    });

    if (!userData) return c.json({ error: "User not found" }, 404);
    if (userData.role !== "medical_organization")
      return c.json({ error: "Invalid role" }, 400);

    const result = await db
      .select({
        id: notifications.id,
        message: notifications.message,
        status: notifications.status,
        token_id: medicalRecords.token_id,
        record_title: medicalRecords.title,
      })
      .from(notifications)
      .innerJoin(medicalRecords, eq(notifications.record_id, medicalRecords.id))
      .innerJoin(users, eq(notifications.org_id, users.id))
      .where(eq(notifications.org_id, auth.userId));

    return c.json({ data: result });
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        token_id: z.string(),
        message: z.string(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const postData = c.req.valid("json");

      if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

      const userData = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, auth.userId),
      });

      if (!userData) return c.json({ error: "User not found" }, 404);
      if (userData.role === USER_ROLE)
        return c.json(
          { error: "Only organizations are allowed to create notifications" },
          400,
        );

      const recordData = await db.query.medicalRecords.findFirst({
        where: (record, { eq }) => eq(record.token_id, postData.token_id),
        columns: {
          id: true,
          user_id: true,
        },
      });
      if (!recordData)
        return c.json(
          { error: `Record with Token ID ${postData.token_id} not found` },
          404,
        );
      const newNotification = await db
        .insert(notifications)
        .values({
          org_id: auth.userId,
          message: postData.message,
          record_id: recordData.id,
          user_id: recordData.user_id,
        })
        .returning();

      return c.json(newNotification[0], 201);
    },
  )
  .delete(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);
      if (!id) return c.json({ error: "Notification ID required" }, 400);

      const notif = await db.query.notifications.findFirst({
        where: (record, { eq }) => eq(record.id, id),
      });
      if (!notif) return c.json({ error: "Notification not found" }, 404);

      const deletedNotification = await db
        .delete(notifications)
        .where(eq(notifications.id, id))
        .returning();

      return c.json(deletedNotification[0], 201);
    },
  )
  .patch(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator(
      "json",
      z.object({ status: z.enum(["approved", "denied"]).optional() }),
    ),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

      const { id } = c.req.valid("param");
      const { status } = c.req.valid("json");

      if (!id || !status)
        return c.json({ error: "Missing required fields" }, 400);

      // only users can patch notifications. The 'and' check ensures that only the user who the notification was issued to, is patching the notification
      const notif = await db.query.notifications.findFirst({
        where: (record, { eq, and }) =>
          and(eq(record.id, id), eq(record.user_id, auth.userId)),
      });
      if (!notif) return c.json({ error: "Notification not found" }, 404);

      const updatedNotification = await db
        .update(notifications)
        .set({ status: status })
        .where(eq(notifications.id, id))
        .returning();

      return c.json(updatedNotification[0], 201);
    },
  );

export default notificationsRouter;
