export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "only-no-store";
export const maxDuration = 10;

import { db } from "@/db/drizzle";
import { organizationGrantedTokens } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orgAddress = searchParams.get("orgAddress");
    if (!orgAddress)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    const orgData = await db.query.organizationWalletTable.findFirst({
      where: (record, { eq }) => eq(record.wallet_address, orgAddress),
      columns: {
        organization_name: true,
        wallet_address: false,
      },
    });

    const orgName = orgData?.organization_name;
    if (!orgName)
      return NextResponse.json(
        { error: "Failed to fetch Organization Name" },
        { status: 401 },
      );
    const grantedTokens = await db.query.organizationGrantedTokens.findMany({
      where: (record, { eq }) => eq(record.org_name, orgName),
      columns: {
        org_name: false,
        token_id: true,
        title: true,
        description: true,
      },
    });

    if (grantedTokens.length === 0)
      return NextResponse.json({ error: "No Records Found" }, { status: 404 });

    return NextResponse.json(grantedTokens, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

interface AccessPostRequest {
  org_name: string;
  token_id: string;
}
export async function POST(request: NextRequest) {
  try {
    const body: AccessPostRequest = await request.json();
    if (!body.org_name || !body.token_id)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );

    const userData = await db.query.userNFTsTable.findFirst({
      where: (record, { eq }) => eq(record.token_id, body.token_id),
    });

    if (!userData)
      return NextResponse.json(
        { error: "Token ID not found" },
        { status: 404 },
      );

    const title = userData.title;
    const description = userData.description;

    const newRecord = await db
      .insert(organizationGrantedTokens)
      .values({
        org_name: body.org_name,
        token_id: body.token_id,
        title,
        description,
      })
      .returning();

    if (newRecord.length === 0)
      return NextResponse.json(
        { error: "Organization already has access to token" },
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
