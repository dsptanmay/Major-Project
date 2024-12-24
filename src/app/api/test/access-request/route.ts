import { db } from "@/db/drizzle";
import { accessRequests, accessStatusEnum } from "@/db/schema_2";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token_id, org_wallet_address } = body;
    const orgData = await db.query.users.findFirst({
      where: (record, { eq, and }) =>
        and(
          eq(record.wallet_address, org_wallet_address),
          eq(record.role, "medical_organization"),
        ),
      columns: {
        id: true,
      },
    });
    const recordData = await db.query.medicalRecords.findFirst({
      where: (record, { eq }) => eq(record.token_id, token_id),
      columns: {
        id: true,
      },
    });

    if (!recordData)
      return NextResponse.json({ error: "Invalid token id" }, { status: 400 });

    if (!orgData)
      return NextResponse.json(
        { error: "Invalid organization" },
        { status: 400 },
      );

    const newAccessRequest = await db
      .insert(accessRequests)
      .values({
        record_id: recordData.id,
        organization_id: orgData.id,
      })
      .returning();

    return NextResponse.json(newAccessRequest[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create access request" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orgAddress = searchParams.get("orgAddress");

    if (!orgAddress)
      return NextResponse.json(
        { error: "Missing organization wallet address" },
        { status: 400 },
      );
    const orgData = await db.query.users.findFirst({
      where: (record, { eq }) => eq(record.wallet_address, orgAddress),
      columns: {
        id: true,
      },
    });
    if (!orgData)
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 },
      );

    const accessRecords = await db.query.accessRequests.findMany({
      where: (record, { eq, and }) =>
        and(
          eq(record.organization_id, orgData.id),
          eq(record.status, "approved"),
        ),
    });
    return NextResponse.json(accessRecords);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch access requests" },
      { status: 500 },
    );
  }
}

type AccessPatchRequest = {
  token_id: string;
  status: "approved" | "denied";
};
export async function PATCH(request: NextRequest) {
  try {
    const body: AccessPatchRequest = await request.json();
    const { token_id, status } = body;
    const recordData = await db.query.medicalRecords.findFirst({
      where: (record, { eq }) => eq(record.token_id, token_id),
      columns: {
        id: true,
      },
    });
    if (!recordData)
      return NextResponse.json({ error: "Invalid Token ID" }, { status: 400 });

    const updatedRecord = await db
      .update(accessRequests)
      .set({ status: status, processed_at: new Date() })
      .where(eq(accessRequests.record_id, recordData.id))
      .returning();

    return NextResponse.json(updatedRecord, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update access request" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tokenId = searchParams.get("tokenId");
    if (!tokenId)
      return NextResponse.json(
        { error: "Token ID is required" },
        { status: 400 },
      );
    const recordData = await db.query.medicalRecords.findFirst({
      where: (record, { eq }) => eq(record.token_id, tokenId),
      columns: {
        id: true,
      },
    });

    if (!recordData)
      return NextResponse.json({ status: "Record not found" }, { status: 404 });

    const deletedRequest = await db
      .delete(accessRequests)
      .where(eq(accessRequests.record_id, recordData.id))
      .returning();

    return NextResponse.json(deletedRequest[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete access request" },
      { status: 500 },
    );
  }
}
