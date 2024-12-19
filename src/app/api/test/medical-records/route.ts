import { db } from "@/db/drizzle";
import { medicalRecords } from "@/db/schema_2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { wallet_address, token_id, encryption_key, title, description } =
      body;

    const user = await db.query.users.findFirst({
      where: (record, { eq }) => eq(record.wallet_address, wallet_address),
      columns: {
        id: true,
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newRecord = await db
      .insert(medicalRecords)
      .values({
        user_id: user.id,
        token_id,
        encryption_key,
        title,
        description,
      })
      .returning();

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create record" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const walletAddress = searchParams.get("walletAddress");
    if (!walletAddress)
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 },
      );

    const userData = await db.query.users.findFirst({
      where: (record, { eq }) => eq(record.wallet_address, walletAddress),
      columns: {
        id: true,
      },
    });

    if (!userData)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userRecords = await db.query.medicalRecords.findMany({
      where: (record, { eq }) => eq(record.user_id, userData.id),
      orderBy: (records, { desc }) => desc(records.uploaded_at),
    });
    return NextResponse.json(userRecords);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 },
    );
  }
}
