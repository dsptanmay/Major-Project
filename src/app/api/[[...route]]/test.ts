import { db } from "@/db/drizzle";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";

const testRouter = new Hono()
  .use(prettyJSON())
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ error: "unauth" }, 401);

    const userRequests = await db.query.users.findFirst({
      columns: {
        username: true,
      },
      where: (users, { eq, and }) =>
        and(eq(users.role, "user"), eq(users.id, auth.userId)),
      with: {
        medicalRecords: {
          with: {
            accessRequests: {
              with: {
                organization: true,
              },
            },
          },
        },
      },
    });
    return c.json(userRequests);
  });

export default testRouter;
