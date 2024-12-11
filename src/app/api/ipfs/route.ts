import { contract } from "@/app/client";
import { NextRequest, NextResponse } from "next/server";
import { readContract } from "thirdweb";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tokenId = searchParams.get("tokenId");
    const userAdd = searchParams.get("userAddress");
    if (!tokenId || !userAdd)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );

    const data = await readContract({
      contract,
      method:
        "function getIPFSHash(uint256 tokenId, address caller) view returns (string)",
      params: [BigInt(tokenId), userAdd],
    });

    if (data) return NextResponse.json(data, { status: 200 });

    return NextResponse.json({ error: "IPFS Hash Not Found" }, { status: 404 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
