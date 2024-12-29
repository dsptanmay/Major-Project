import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Wallet } from "lucide-react";

function MissingWalletComponent() {
  return (
    <div>
      <Alert className="bg-red-300">
        <Wallet className="size-4" />
        <AlertTitle>Missing Wallet</AlertTitle>
        <AlertDescription>Please connect your wallet first!</AlertDescription>
      </Alert>
    </div>
  );
}

export default MissingWalletComponent;
