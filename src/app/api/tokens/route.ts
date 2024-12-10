import { db } from "@/db/drizzle";
import { tokenEncryptions } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body: { token_id: string; encryption_key: string } =
      await request.json();
    const { token_id, encryption_key } = body;
    if (!token_id || !encryption_key)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );

    const newRecord = await db
      .insert(tokenEncryptions)
      .values({ token_id, encryption_key })
      .returning();
    if (newRecord.length === 0)
      return NextResponse.json(
        { error: "Failed to insert data" },
        { status: 401 },
      );

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
