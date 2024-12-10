"use client";
import { contract } from "@/app/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import React, { useEffect, useState } from "react";
import { readContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";

function UserViewPage({ params }: { params: { token_id: string } }) {
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [ipfsURL, setIpfsURL] = useState("");
  const activeAccount = useActiveAccount();
  const tokenId = params.token_id;

  useEffect(() => {
    const fetchData = async (token_id: bigint, caller: string) => {
      const _uri = await readContract({
        contract,
        method:
          "function getIPFSHash(uint256 tokenId, address caller) view returns (string)",
        params: [token_id, caller],
      });
      if (_uri) {
        setIpfsURL(
          `https://${process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}.ipfscdn.io/ipfs/${_uri.substring(7)}`,
        );
        setIsFetched(true);
      }
    };
    if (activeAccount) fetchData(BigInt(tokenId), activeAccount.address);
  }, [activeAccount, isFetched, tokenId]);
  if (!activeAccount)
    return (
      <div>
        <Alert className="bg-red-300">
          <Wallet className="h-4 w-4" />
          <AlertTitle>Missing Wallet</AlertTitle>
          <AlertDescription>Please connect your wallet first!</AlertDescription>
        </Alert>
      </div>
    );
  return (
    <div className="flex w-full max-w-6xl flex-col space-y-5 border-[3px] border-border bg-white p-5 shadow-light">
      <h1>Document for Token ID {tokenId}</h1>
      {isFetched && <Button className="w-full">Decrypt Document</Button>}
    </div>
  );
}

export default UserViewPage;
