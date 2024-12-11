"use client";
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
import { AlertCircle, Wallet as WalletIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";

// const sampleData: Notification[] = [
//   {
//     organization_name: "health_organization",
//     organization_address: "0x12321214124124",
//     token_id: "1",
//     comments: "Hello There",
//   },
// ];

type Notification = {
  org_name: string;
  org_address: string;
  nft_token_id: string;
  comments: string;
};

function UserNotificationsPage() {
  const activeAccount = useActiveAccount();
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

  const handleApprove = (notification: Notification) => {
    console.log(`Token ID: ${notification.nft_token_id}`);
  };
  const handleDeny = (notification: Notification) => {};

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
                >
                  Deny
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default UserNotificationsPage;
