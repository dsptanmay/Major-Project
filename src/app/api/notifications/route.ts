import { db } from "@/db/drizzle";
import { notificationsTable, organizationWalletTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
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

interface UpdateNotificationRequest {
  org_address: string;
  user_address: string;
  token_id: string;
  status: "approved" | "denied";
}

export async function PATCH(request: NextRequest) {
  try {
    const body: UpdateNotificationRequest = await request.json();
    if (
      !body.org_address ||
      !body.user_address ||
      !body.token_id ||
      !body.status
    )
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    if (body.status !== "approved" && body.status !== "denied")
      return NextResponse.json({ error: "Invalid status" }, { status: 401 });

    const updatedNotification = await db
      .update(notificationsTable)
      .set({ status: body.status })
      .where(
        and(
          eq(notificationsTable.org_address, body.org_address),
          eq(notificationsTable.user_address, body.user_address),
          eq(notificationsTable.nft_token_id, body.token_id),
        ),
      )
      .returning();

    if (updatedNotification.length === 0)
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 },
      );
    return NextResponse.json(updatedNotification, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orgAddress = searchParams.get("orgAddress");
    const userAddress = searchParams.get("userAddress");
    const tokenId = searchParams.get("tokenId");

    if (!tokenId || !userAddress || !orgAddress)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );

    const deletedNotification = await db
      .delete(notificationsTable)
      .where(
        and(
          eq(notificationsTable.org_address, orgAddress),
          eq(notificationsTable.user_address, userAddress),
          eq(notificationsTable.nft_token_id, tokenId),
        ),
      )
      .returning();

    if (deletedNotification.length === 0)
      return NextResponse.json(
        { error: "Failed to delete notification" },
        { status: 401 },
      );

    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
