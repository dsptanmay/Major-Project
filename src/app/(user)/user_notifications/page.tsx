"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Wallet } from "lucide-react";
import React from "react";
import { useActiveAccount } from "thirdweb/react";

function UserNotificationsPage() {
  const activeAccount = useActiveAccount();

  if (!activeAccount)
    return (
      <div className="">
        <Alert className="bg-red-300">
          <Wallet className="h-4 w-4" />
          <AlertTitle>Missing crypto wallet</AlertTitle>
          <AlertDescription>Please connect your wallet first!</AlertDescription>
        </Alert>
      </div>
    );
  return (
    <div className="flex w-full max-w-5xl flex-col space-y-5 border-[3px] border-border bg-white p-5 shadow-dark">
      <h2>Notifications for </h2>
    </div>
  );
}

export default UserNotificationsPage;
