import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  clerkMiddleware as clerkHonoMiddleware,
  getAuth,
} from "@hono/clerk-auth";

import { insertRecordSchema, medicalRecords } from "@/db/schema";
import { db } from "@/db/drizzle";
import { z } from "zod";

const medicalRecordsRouter = new Hono()
  .use("*", clerkHonoMiddleware())
  .get("/", async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

    const records = await db.query.medicalRecords.findMany({
      where: (record, { eq }) => eq(record.user_id, auth.userId),
    });
    return c.json({ records });
  })
  .get(
    "/:token_id",
    zValidator("param", z.object({ token_id: z.string().optional() })),
    async (c) => {
      const auth = getAuth(c);
      const { token_id } = c.req.valid("param");
      if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);
      if (!token_id) return c.json({ error: "Token ID required" }, 401);

      const recordData = await db.query.medicalRecords.findFirst({
        where: (record, { eq }) => eq(record.token_id, token_id),
      });

      if (!recordData) return c.json({ error: "Record not found" }, 404);

      if (recordData.user_id === auth.userId)
        return c.json({ record: recordData });

      const accessData = await db.query.accessRequests.findFirst({
        where: (request, { and, eq }) =>
          and(
            eq(request.organization_id, auth.userId),
            eq(request.record_id, recordData.id),
            eq(request.status, "approved"),
          ),
        columns: {
          status: true,
        },
      });
      if (!accessData)
        return c.json(
          { error: "No access request found for this record" },
          404,
        );
      return c.json({ record: recordData });
    },
  )
  .post(
    "/",
    zValidator(
      "json",
      insertRecordSchema.omit({ id: true, uploaded_at: true, user_id: true }),
    ),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);
      const data = c.req.valid("json");
      try {
        const newRecord = await db
          .insert(medicalRecords)
          .values({ ...data, user_id: auth.userId })
          .returning();

        if (newRecord.length === 0)
          return c.json({ error: "Failed to insert record" }, 400);

        return c.json(newRecord[0], 201);
      } catch (error) {
        console.error(error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  );

export default medicalRecordsRouter;
