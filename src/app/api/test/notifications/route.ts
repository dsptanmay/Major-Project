import { db } from "@/db/drizzle";
import { notifications } from "@/db/schema_2";
import { eq, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { org_wallet_address, token_id, message } = body;
    const recordData = await db.query.medicalRecords.findFirst({
      where: (record, { eq }) => eq(record.token_id, token_id),
      columns: {
        user_id: true,
        id: true,
      },
    });
    const orgData = await db.query.users.findFirst({
      where: (record, { eq }) => eq(record.wallet_address, org_wallet_address),
      columns: {
        id: true,
      },
    });
    if (!recordData)
      return NextResponse.json(
        { error: "Token ID not found" },
        { status: 404 },
      );
    if (!orgData)
      return NextResponse.json(
        { error: "Invalid Wallet Address" },
        { status: 400 },
      );
    const newNotification = await db
      .insert(notifications)
      .values({
        org_id: orgData.id,
        user_id: recordData.user_id,
        record_id: recordData.id,
        message: message,
      })
      .returning();
    return NextResponse.json(newNotification[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const walletAddress = searchParams.get("walletAddress");
    if (!walletAddress)
      return NextResponse.json(
        { error: "Missing Wallet Address" },
        { status: 400 },
      );

    const user = await db.query.users.findFirst({
      where: (record, { eq }) => eq(record.wallet_address, walletAddress),
      columns: { id: true },
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userNotifications = await db
      .select()
      .from(notifications)
      .where(
        or(
          eq(notifications.user_id, user.id),
          eq(notifications.org_id, user.id),
        ),
      );

    return NextResponse.json(userNotifications);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}

type NotificationPatchRequest = {
  token_id: string;
  status: "approved" | "denied";
};

export async function PATCH(request: NextRequest) {
  try {
    const body: NotificationPatchRequest = await request.json();
    const { token_id, status } = body;
    const recordData = await db.query.medicalRecords.findFirst({
      where: (record, { eq }) => eq(record.token_id, token_id),
      columns: {
        id: true,
      },
    });

    if (!recordData)
      return NextResponse.json({ error: "Record not found" }, { status: 404 });

    const updatedNotification = await db
      .update(notifications)
      .set({ status: status })
      .returning();
    return NextResponse.json(updatedNotification[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
