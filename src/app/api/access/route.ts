import { db } from "@/db/drizzle";
import {
  notificationsTable,
  organizationGrantedTokens,
  organizationWalletTable,
  userNFTsTable,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
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

    const userTokens = await db
      .select({
        organization_name: organizationGrantedTokens.org_name,
        organization_address: organizationWalletTable.wallet_address,
        title: organizationGrantedTokens.title,
        token_id: organizationGrantedTokens.token_id,
      })
      .from(organizationGrantedTokens)
      .innerJoin(
        organizationWalletTable,
        eq(
          organizationGrantedTokens.org_name,
          organizationWalletTable.organization_name,
        ),
      )
      .innerJoin(
        userNFTsTable,
        eq(organizationGrantedTokens.token_id, userNFTsTable.token_id),
      )
      .where(eq(userNFTsTable.user_address, userAddress!));

    if (userTokens.length === 0)
      return NextResponse.json({ error: "No records found" }, { status: 404 });

    return NextResponse.json(userTokens, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const org_name = searchParams.get("orgName");
    const token_id = searchParams.get("tokenId");
    if (!org_name || !token_id)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );

    const deletedRecord = await db
      .delete(organizationGrantedTokens)
      .where(
        and(
          eq(organizationGrantedTokens.org_name, org_name),
          eq(organizationGrantedTokens.token_id, token_id),
        ),
      )
      .returning();

    const deletedNotification = await db
      .delete(notificationsTable)
      .where(
        and(
          eq(notificationsTable.nft_token_id, token_id),
          eq(notificationsTable.org_name, org_name),
        ),
      )
      .returning();
    if (deletedNotification.length === 0 || deletedRecord.length === 0)
      return NextResponse.json({ error: "Missing token ID" }, { status: 404 });

    return NextResponse.json(
      { message: "Deleted records successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
