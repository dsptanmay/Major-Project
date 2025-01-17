import { Hono } from "hono";
import {
  clerkMiddleware as clerkHonoMiddleware,
  getAuth,
} from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db/drizzle";
import { and, eq } from "drizzle-orm";
import { accessRequests, notifications } from "@/db/schema";

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

    const data = await db.query.accessRequests.findMany({
      where: (request, { eq, and }) =>
        and(
          eq(request.organization_id, auth.userId),
          eq(request.status, "approved"),
        ),
      columns: {
        id: true,
        requested_at: true,
        processed_at: true,
      },
      with: {
        record: {
          columns: {
            title: true,
            description: true,
            token_id: true,
          },
        },
      },
    });

    return c.json({ data }, 200);
  })
  .get("/user", async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

    const userRecords = await db.query.medicalRecords.findMany({
      where: (record, { eq }) => eq(record.user_id, auth.userId),
      columns: { id: true },
    });

    const recordIds = userRecords.map((record) => record.id);

    const data = await db.query.accessRequests.findMany({
      where: (request, { eq, and, inArray }) =>
        and(
          inArray(request.record_id, recordIds),
          eq(accessRequests.status, "approved"),
        ),
      columns: {
        id: true,
        processed_at: true,
      },
      with: {
        record: {
          columns: {
            title: true,
            token_id: true,
          },
        },
        organization: {
          columns: {
            username: true,
            wallet_address: true,
          },
        },
      },
    });

    return c.json({ data });
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

      const requestData = await db.query.accessRequests.findFirst({
        where: (record, { eq }) => eq(record.id, id),
      });

      if (!requestData) return c.json({ error: "Request not found" }, 404);

      const deletedRequest = await db
        .delete(accessRequests)
        .where(eq(accessRequests.id, id))
        .returning();

      const deletedNotif = await db
        .delete(notifications)
        .where(
          and(
            eq(notifications.record_id, requestData.record_id),
            eq(notifications.org_id, requestData.organization_id),
          ),
        )
        .returning();

      if (deletedRequest.length === 0 || deletedNotif.length === 0)
        return c.json({ error: "Failed to delete request" }, 500);

      return c.json(deletedRequest[0], 201);
    },
  )
  .delete(
    "/",
    zValidator(
      "query",
      z.object({
        org_id: z.string().optional(),
        token_id: z.string().optional(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

      const { org_id, token_id } = c.req.valid("query");
      if (!org_id || !token_id)
        return c.json({ error: "Missing rqeuired fields" }, 400);

      const recordData = await db.query.medicalRecords.findFirst({
        where: (record, { eq }) => eq(record.token_id, token_id),
        columns: {
          id: true,
        },
      });
      if (!recordData) return c.json({ error: "Record not found" }, 404);
      if (auth.userId !== org_id)
        return c.json({ error: "Invalid User ID" }, 400);

      const deletedRequest = await db
        .delete(accessRequests)
        .where(
          and(
            eq(accessRequests.organization_id, org_id),
            eq(accessRequests.record_id, recordData.id),
          ),
        )
        .returning();

      if (deletedRequest.length === 0)
        return c.json({ error: "Access request not found" }, 404);
      return c.json(deletedRequest[0], 201);
    },
  )
  .patch(
    "/",
    zValidator(
      "json",
      z.object({
        status: z.enum(["approved", "denied"]).optional(),
        token_id: z.string().optional(),
        org_name: z.string().optional(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { status, token_id, org_name } = c.req.valid("json");
      if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);
      if (!token_id || !status || !org_name)
        return c.json({ error: "Missing required fields" }, 400);

      const recordData = await db.query.medicalRecords.findFirst({
        where: (record, { eq }) => eq(record.token_id, token_id),
      });
      const orgData = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.username, org_name),
      });

      if (!recordData || !orgData)
        return c.json({ error: "Record or Organization not found" }, 404);

      const updatedRequest = await db
        .update(accessRequests)
        .set({ status: status, processed_at: new Date() })
        .where(
          and(
            eq(accessRequests.organization_id, orgData.id),
            eq(accessRequests.record_id, recordData.id),
          ),
        )
        .returning();

      if (updatedRequest.length === 0)
        return c.json({ error: "Request not found" }, 404);

      return c.json(updatedRequest[0], 201);
    },
  );

export default accessRequestsRouter;
