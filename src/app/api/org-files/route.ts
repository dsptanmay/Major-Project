import { db } from "@/db/drizzle";
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
