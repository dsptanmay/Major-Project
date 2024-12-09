import { db } from "@/db/drizzle";
import {
  organizationGrantedTokens,
  organizationWalletTable,
  userNFTsTable,
} from "@/db/schema";
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
