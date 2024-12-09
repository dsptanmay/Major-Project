import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clerkClient();
    const { role, user_id } = body;
    if (!role || !user_id)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );

    const currentRole = (await client.users.getUser(user_id)).publicMetadata
      .role;

    if (!currentRole) {
      client.users.updateUserMetadata(user_id, { publicMetadata: { role } });
      return NextResponse.json(
        { message: "Role set successfully" },
        { status: 201 },
      );
    } else {
      return NextResponse.json(
        { error: "User already has role" },
        { status: 409 },
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
