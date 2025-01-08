import { db } from "@/db/drizzle";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";

const testRouter = new Hono()
  .use(prettyJSON())
  .get("/user", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ error: "unauth" }, 401);

    // const result = await db
    //       .select({
    //         id: notifications.id,
    //         message: notifications.message,
    //         token_id: medicalRecords.token_id,
    //         org_username: users.username,
    //         org_wallet_address: users.wallet_address,
    //       })
    //       .from(notifications)
    //       .innerJoin(medicalRecords, eq(notifications.record_id, medicalRecords.id))
    //       .innerJoin(users, eq(notifications.org_id, users.id))
    //       .where(
    //         and(
    //           eq(notifications.user_id, auth.userId),
    //           eq(notifications.status, "pending"),
    //         ),
    //       );
    // const userRequests = await db.query.users.findFirst({
    //   columns: {
    //     username: true,
    //   },
    //   where: (users, { eq, and }) =>
    //     and(eq(users.role, "user"), eq(users.id, auth.userId)),
    //   with: {
    //     medicalRecords: {
    //       with: {
    //         accessRequests: {
    //           with: {
    //             organization: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    // });
    const data = await db.query.notifications.findMany({
      where: (notif, { eq, and }) =>
        and(eq(notif.user_id, auth.userId), eq(notif.status, "pending")),
      columns: {
        id: true,
        message: true,
      },
      with: {
        record: {
          columns: {
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
    return c.json(data);
  })
  .get("/org", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

    const data = await db.query.notifications.findMany({
      where: (notification, { eq }) => eq(notification.org_id, auth.userId),
      columns: {
        id: true,
        message: true,
        status: true,
      },
      with: {
        record: {
          columns: {
            token_id: true,
            title: true,
          },
        },
      },
    });
    return c.json(data);
  });

export default testRouter;
