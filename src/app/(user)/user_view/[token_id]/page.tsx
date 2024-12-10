"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Wallet } from "lucide-react";
import React from "react";
import { useActiveAccount } from "thirdweb/react";

function UserViewPage({ params }: { params: { token_id: string } }) {
  const activeAccount = useActiveAccount();
  const tokenId = params.token_id;
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
    <div className="flex w-full max-w-6xl flex-col border-[3px] border-border bg-white p-5 shadow-light">
      {tokenId}
    </div>
  );
}

export default UserViewPage;
