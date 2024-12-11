import { db } from "@/db/drizzle";
import { notificationsTable, organizationWalletTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userAddress = searchParams.get("userAddress");
    const orgAddress = searchParams.get("orgAddress");
    if (!userAddress && !orgAddress)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );

    let notifications;
    if (userAddress) {
      notifications = await db
        .select()
        .from(notificationsTable)
        .where(eq(notificationsTable.user_address, userAddress));
      if (notifications.length === 0)
        return NextResponse.json(
          { error: "No notifications found" },
          { status: 404 },
        );

      return NextResponse.json(notifications, { status: 200 });
    }
    if (orgAddress) {
      notifications = await db
        .select({
          user_address: notificationsTable.user_address,
          token_id: notificationsTable.nft_token_id,
          comments: notificationsTable.comments,
          status: notificationsTable.status,
        })
        .from(notificationsTable)
        .where(eq(notificationsTable.org_address, orgAddress));

      if (notifications.length === 0)
        return NextResponse.json(
          { error: "No notifications found" },
          { status: 404 },
        );
      return NextResponse.json(notifications, { status: 200 });
    }

    return NextResponse.json(notifications, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const notificationData = await request.json();
    const { org_address, org_name, nft_token_id, comments } = notificationData;

    if (!org_address || !org_name || !nft_token_id || !comments)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );

    // Insert Organization's wallet address if not already existing
    const existingOrg = await db
      .select()
      .from(organizationWalletTable)
      .where(eq(organizationWalletTable.wallet_address, org_address));

    if (existingOrg.length === 0)
      await db
        .insert(organizationWalletTable)
        .values({ organization_name: org_name, wallet_address: org_address });

    const userRecord = await db.query.userNFTsTable.findFirst({
      where: (records, { eq }) => eq(records.token_id, nft_token_id),
      columns: {
        token_id: false,
        description: false,
        title: false,
        user_address: true,
      },
    });
    const user_address = userRecord!.user_address;
    const newNotification = await db
      .insert(notificationsTable)
      .values({
        org_address,
        org_name,
        user_address,
        nft_token_id,
        comments,
        status: "pending",
      })
      .returning();

    return NextResponse.json(newNotification[0], { status: 201 });
  } catch (error) {
    console.error("Error creating notification:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
