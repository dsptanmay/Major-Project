import { db } from "@/db/drizzle";
import { userRoleEnum, users } from "@/db/schema_2";
import { clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 },
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.wallet_address, walletAddress),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

type CreateUserRequest = {
  wallet_address: string;
  role: (typeof userRoleEnum.enumValues)[number];
  clerk_user_id: string;
  username: string;
};

export async function POST(req: NextRequest) {
  try {
    const body: CreateUserRequest = await req.json();
    const client = await clerkClient();
    const { wallet_address, role, clerk_user_id, username } = body;
    const existingUser = await db.query.users.findFirst({
      where: (record, { eq }) => eq(record.wallet_address, wallet_address),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Wallet Address already registered" },
        { status: 400 },
      );
    }
    const currentRole = (await client.users.getUser(clerk_user_id))
      .publicMetadata.role;
    if (currentRole)
      return NextResponse.json(
        {
          error: "User already has role",
        },
        { status: 400 },
      );
    const newUser = await db
      .insert(users)
      .values({ wallet_address, role, username })
      .returning();
    client.users.updateUserMetadata(clerk_user_id, {
      publicMetadata: { role },
    });

    return NextResponse.json(newUser[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
