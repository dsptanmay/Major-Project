import { db } from "@/db/drizzle";
import {
  accessRequests,
  accessStatusEnum,
  medicalRecords,
  notifications,
  users,
} from "@/db/schema_2";
import { and, eq, inArray } from "drizzle-orm";
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
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress)
      return NextResponse.json(
        { error: "Missing wallet address" },
        { status: 400 },
      );
    const userData = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.wallet_address, walletAddress),
      columns: {
        id: true,
        role: true,
      },
    });
    if (!userData)
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 },
      );

    if (userData.role === "medical_organization") {
      const orgRecords = await db
        .select({
          requestId: accessRequests.id,
          recordTitle: medicalRecords.title,
          recordDescription: medicalRecords.description,
          recordTokenId: medicalRecords.token_id,
          requestedAt: accessRequests.requested_at,
          processedAt: accessRequests.processed_at,
        })
        .from(accessRequests)
        .innerJoin(
          medicalRecords,
          eq(accessRequests.record_id, medicalRecords.id),
        )
        .innerJoin(users, eq(medicalRecords.user_id, users.id))
        .where(
          and(
            eq(accessRequests.organization_id, userData.id),
            eq(accessRequests.status, "approved"),
          ),
        );
      return NextResponse.json(orgRecords, { status: 200 });
    } else if (userData.role === "user") {
      const userRecords = await db
        .select({
          recordId: medicalRecords.id,
        })
        .from(medicalRecords)
        .innerJoin(users, eq(medicalRecords.user_id, users.id))
        .where(eq(users.wallet_address, walletAddress));
      const recordIds = userRecords.map((record) => record.recordId);
      if (recordIds.length === 0) {
        return NextResponse.json(
          { error: "No records found for this user" },
          { status: 404 },
        );
      }

      const approvedRequests = await db
        .select({
          requestId: accessRequests.id,
          recordTitle: medicalRecords.title,
          recordTokenId: medicalRecords.token_id,
          processedAt: accessRequests.processed_at,
          organizationName: users.username, // Organization's name
          organizationWallet: users.wallet_address, // Organization's wallet address
        })
        .from(accessRequests)
        .innerJoin(
          medicalRecords,
          eq(accessRequests.record_id, medicalRecords.id),
        ) // Join to get record details
        .innerJoin(users, eq(accessRequests.organization_id, users.id)) // Join to get organization details
        .where(
          and(
            inArray(accessRequests.record_id, recordIds), // Filter by record IDs
            eq(accessRequests.status, "approved"), // Only approved requests
          ),
        );
      return NextResponse.json(approvedRequests, { status: 200 });
    }
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
  org_wallet_address: string;
  status: "approved" | "denied";
};
export async function PATCH(request: NextRequest) {
  try {
    const body: AccessPatchRequest = await request.json();
    const { token_id, status, org_wallet_address } = body;
    const recordData = await db.query.medicalRecords.findFirst({
      where: (record, { eq }) => eq(record.token_id, token_id),
      columns: {
        id: true,
      },
    });
    const orgData = await db.query.users.findFirst({
      where: (record, { eq }) => eq(record.wallet_address, org_wallet_address),
      columns: {
        id: true,
      },
    });

    if (!recordData || !orgData)
      return NextResponse.json({ error: "Invalid Token ID" }, { status: 400 });

    const updatedRecord = await db
      .update(accessRequests)
      .set({ status: status, processed_at: new Date() })
      .where(
        and(
          eq(accessRequests.record_id, recordData.id),
          eq(accessRequests.organization_id, orgData.id),
        ),
      )
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
    const requestId = searchParams.get("id");
    if (!requestId)
      return NextResponse.json(
        { error: "Access Request ID is required" },
        { status: 400 },
      );
    const accessRequest = await db.query.accessRequests.findFirst({
      where: (record, { eq }) => eq(record.id, requestId),
      columns: {
        record_id: true,
        organization_id: true,
      },
    });

    if (!accessRequest)
      return NextResponse.json(
        { error: "Access Request with given ID not found" },
        { status: 404 },
      );

    await db
      .delete(notifications)
      .where(
        and(
          eq(notifications.record_id, accessRequest.record_id),
          eq(notifications.org_id, accessRequest.organization_id),
        ),
      );

    const deletedRequest = await db
      .delete(accessRequests)
      .where(eq(accessRequests.id, requestId))
      .returning();

    return NextResponse.json(deletedRequest, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete access request" },
      { status: 500 },
    );
  }
}
