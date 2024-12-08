"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Wallet } from "lucide-react";
import React from "react";
import { useActiveAccount } from "thirdweb/react";

function RecordsPageContent() {
  const activeAccount = useActiveAccount();
  if (!activeAccount)
    return (
      <div>
        <Alert className="bg-red-300">
          <Wallet className="h-4 w-4" />
          <AlertTitle>Missing Crypto Wallet</AlertTitle>
          <AlertDescription>Please connect your wallet first!</AlertDescription>
        </Alert>
      </div>
    );
  return <div>RecordsPageContent</div>;
}

export default RecordsPageContent;
