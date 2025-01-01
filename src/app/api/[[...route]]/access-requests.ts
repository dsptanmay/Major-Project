import { Hono } from "hono";
import {
  clerkMiddleware as clerkHonoMiddleware,
  getAuth,
} from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db/drizzle";
import { and, eq, inArray } from "drizzle-orm";
import { accessRequests, medicalRecords, users } from "@/db/schema";

import { z } from "zod";

const accessRequestsRouter = new Hono()
  .use("*", clerkHonoMiddleware())
  .get("/", async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);
    return c.json({});
  })
  .get("/org", async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

    const requests = await db
      .select({
        id: accessRequests.id,
        title: medicalRecords.title,
        description: medicalRecords.description,
        token_id: medicalRecords.token_id,
        requested_at: accessRequests.requested_at,
        processed_at: accessRequests.processed_at,
      })
      .from(accessRequests)
      .innerJoin(medicalRecords, eq(accessRequests.record_id, medicalRecords))
      .innerJoin(users, eq(medicalRecords.user_id, users.id))
      .where(
        and(
          eq(accessRequests.organization_id, auth.userId),
          eq(accessRequests.status, "approved"),
        ),
      );

    return c.json({ data: requests }, 200);
  })
  .get("/user", async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

    const userRecords = await db.query.medicalRecords.findMany({
      where: (record, { eq }) => eq(record.user_id, auth.userId),
      columns: { id: true },
    });

    const recordIds = userRecords.map((record) => record.id);

    const approvedRequests = await db
      .select({
        id: accessRequests.id,
        title: medicalRecords.title,
        token_id: medicalRecords.token_id,
        processed_at: accessRequests.processed_at,
        org_username: users.username,
        org_wallet_address: users.wallet_address,
      })
      .from(accessRequests)
      .innerJoin(
        medicalRecords,
        eq(accessRequests.record_id, medicalRecords.id),
      )
      .innerJoin(users, eq(accessRequests.organization_id, users.id))
      .where(
        and(
          inArray(accessRequests.record_id, recordIds),
          eq(accessRequests.status, "approved"),
        ),
      );

    return c.json({ data: approvedRequests });
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        token_id: z.string().optional(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { token_id } = c.req.valid("json");
      if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);
      if (!token_id) return c.json({ error: "Token ID is required" }, 400);

      const userData = await db.query.users.findFirst({
        where: (record, { eq, and }) =>
          and(
            eq(record.id, auth.userId),
            eq(record.role, "medical_organization"),
          ),
      });
      if (!userData) return c.json({ error: "Invalid user" }, 400);

      const recordData = await db.query.medicalRecords.findFirst({
        where: (record, { eq }) => eq(record.token_id, token_id),
      });

      if (!recordData) return c.json({ error: "Record not found" }, 404);

      const newRequest = await db
        .insert(accessRequests)
        .values({ record_id: recordData.id, organization_id: auth.userId })
        .returning();

      return c.json(newRequest[0], 201);
    },
  )
  .delete(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);
      if (!id) return c.json({ error: "Request ID required" }, 400);

      const deletedRequest = await db
        .delete(accessRequests)
        .where(eq(accessRequests.id, id))
        .returning();

      if (deletedRequest.length === 0)
        return c.json({ error: "Request not found" }, 404);

      return c.json(deletedRequest[0], 201);
    },
  )
  .patch(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator(
      "query",
      z.object({ status: z.enum(["approved", "denied"]).optional() }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const { status } = c.req.valid("query");
      if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);
      if (!id || !status)
        return c.json({ error: "Missing required fields" }, 400);

      const updatedNotification = await db
        .update(accessRequests)
        .set({ status: status, processed_at: new Date() })
        .where(eq(accessRequests.id, id))
        .returning();

      if (updatedNotification.length === 0)
        return c.json({ error: "Record not found" }, 404);

      return c.json(updatedNotification[0], 201);
    },
  );

export default accessRequestsRouter;
