"use client";
import { contract } from "@/app/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Wallet as WalletIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";

type Notification = {
  org_name: string;
  org_address: string;
  nft_token_id: string;
  comments: string;
};

function UserNotificationsPage() {
  const activeAccount = useActiveAccount();
  const { toast } = useToast();
  const { mutate: sendTransaction } = useSendTransaction();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `/api/notifications?userAddress=${activeAccount!.address}`,
        { method: "GET", headers: { "Content-Type": "application/json" } },
      );

      if (response.ok) {
        const data: Notification[] = await response.json();
        setNotifications(data);
      } else {
        setNotifications([]);
      }
    };
    if (activeAccount) fetchData();
  }, [activeAccount]);

  const handleApprove = async (notification: Notification) => {
    try {
      const notifResponse = await fetch("/api/notifications", {
        method: "PATCH",
        body: JSON.stringify({
          org_address: notification.org_address,
          user_address: activeAccount!.address,
          token_id: notification.nft_token_id,
          status: "approved",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const grantResponse = await fetch("/api/org-files", {
        method: "POST",
        body: JSON.stringify({
          org_name: notification.org_name,
          token_id: notification.nft_token_id,
        }),
      });

      const transaction = prepareContractCall({
        contract: contract,
        method: "function grantAccess(uint256 tokenId, address user)",
        params: [BigInt(notification.nft_token_id), activeAccount!.address],
      });
      sendTransaction(transaction);

      if (notifResponse.ok && grantResponse.ok) {
        setNotifications((prev) => prev.filter((n) => n != notification));
      } else {
        toast({
          title: "Error",
          description: "Failed to approve access for record",
        });
      }
    } catch (err) {
      console.error("Error in granting access:", err);
    }
  };
  const handleDeny = async (notification: Notification) => {};

  if (!activeAccount)
    return (
      <div className="">
        <Alert className="bg-red-300">
          <WalletIcon className="h-4 w-4" />
          <AlertTitle>Missing crypto wallet</AlertTitle>
          <AlertDescription>Please connect your wallet first!</AlertDescription>
        </Alert>
      </div>
    );

  if (notifications.length === 0)
    return (
      <div>
        <Alert className="bg-yellow-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Notifications</AlertTitle>
          <AlertDescription>User has no pending notifications</AlertDescription>
        </Alert>
      </div>
    );
  return (
    <div className="flex w-full max-w-6xl flex-col space-y-5 border-[3px] border-border bg-white p-5 shadow-dark">
      <h2>
        Notifications for{" "}
        <code>{`${activeAccount.address.substring(0, 6)}...${activeAccount.address.substring(38)}:`}</code>
      </h2>
      <Table>
        <TableCaption>A list of your recent notifications</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Org Name</TableHead>
            <TableHead>Org Address</TableHead>
            <TableHead className="text-center">Token ID</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications.map((notification, i) => (
            <TableRow key={i}>
              <TableCell>{notification.org_name}</TableCell>
              <TableCell>{`${notification.org_address.substring(0, 6)}...${notification.org_address.substring(38)}`}</TableCell>
              <TableCell className="text-center">
                {notification.nft_token_id}
              </TableCell>
              <TableCell>{notification.comments}</TableCell>
              <TableCell className="flex w-full flex-grow space-x-3">
                <Button
                  variant="noShadow"
                  className="flex flex-grow bg-green-300 "
                  onClick={() => handleApprove(notification)}
                >
                  Approve
                </Button>
                <Button
                  variant="noShadow"
                  className="flex flex-grow bg-red-300"
                  onClick={() => handleDeny(notification)}
                >
                  Deny
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Toaster />
    </div>
  );
}

export default UserNotificationsPage;
