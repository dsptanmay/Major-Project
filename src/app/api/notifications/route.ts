import { db } from "@/db/drizzle";
import { notificationsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userAddress = searchParams.get("userAddress");
    if (!userAddress)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );

    const notifications = await db
      .select({
        organization_name: notificationsTable.org_name,
        organization_address: notificationsTable.org_address,
        token_id: notificationsTable.nft_token_id,
        comments: notificationsTable.comments,
      })
      .from(notificationsTable)
      .where(eq(notificationsTable.user_address, userAddress));

    if (notifications.length === 0)
      return NextResponse.json(
        { error: "No notifications found" },
        { status: 404 },
      );
    return NextResponse.json(notifications, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
