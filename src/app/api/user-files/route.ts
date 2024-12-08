export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "only-no-store";
export const maxDuration = 10;

import { db } from "@/db/drizzle";
import { userNFTsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userAddress = searchParams.get("userAddress");
    if (!userAddress)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    const userRecords = await db
      .select({
        title: userNFTsTable.title,
        description: userNFTsTable.description,
        token_id: userNFTsTable.token_id,
      })
      .from(userNFTsTable)
      .where(eq(userNFTsTable.user_address, userAddress));
    if (userRecords.length === 0)
      return NextResponse.json({ error: "No Records Found" }, { status: 404 });

    return NextResponse.json(userRecords, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
