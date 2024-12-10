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
  const [ipfsURL, setIpfsURL] = useState<string | null>(null);
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
  const activeAccount = useActiveAccount();
  const tokenId = params.token_id;

  useEffect(() => {
    const fetchHash = async () => {
      const ipfsResponse = await fetch(
        `/api/ipfs?userAddress=${activeAccount!.address}&tokenId=${tokenId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      const tokenResponse = await fetch(`/api/tokens?tokenId=${tokenId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (ipfsResponse.ok) {
        const ipfsHash: string = await ipfsResponse.json();
        setIpfsURL(
          `https://${process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}.ipfscdn.io/ipfs/${ipfsHash.substring(7)}`,
        );
      } else {
        setIpfsURL(null);
        return;
      }

      if (tokenResponse.ok) {
        const data = await tokenResponse.json();
        setEncryptionKey(data);
      } else {
        setEncryptionKey(null);
      }
      setIsFetched(true);
    };
    if (activeAccount) fetchHash();
  }, [activeAccount, tokenId, isFetched, ipfsURL]);

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
