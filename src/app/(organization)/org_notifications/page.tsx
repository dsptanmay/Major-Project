"use client";
import React, { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Wallet } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Notification = {
  user_address: string;
  token_id: string;
  comments: string;
  status: "pending" | "approved" | "denied";
};

const StatusBadge: React.FC<{ status: Notification["status"] }> = ({
  status,
}) => {
  const statusStyles = {
    pending: "bg-yellow-200",
    approved: "bg-green-300",
    denied: "bg-red-300",
  };
  const statusText = {
    pending: "Pending",
    approved: "Approved",
    denied: "Denied",
  };

  return (
    <Badge className={`${statusStyles[status]} text-md px-3 py-2`}>
      {statusText[status]}
    </Badge>
  );
};

export default function OrgNotificationsPage() {
  const activeAccount = useActiveAccount();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/notifications?orgAddress=${activeAccount?.address}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        } else {
          setNotifications([]);
          return;
        }
      } catch (error) {
        console.error(error);
        setNotifications([]);
      }
    };
    if (activeAccount) fetchData();
  });
  if (!activeAccount) {
    return (
      <div>
        <Alert className="bg-red-300">
          <Wallet className="h-4 w-4" />
          <AlertTitle>Missing Crypto Wallet</AlertTitle>
          <AlertDescription>Please connect your wallet first!</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (notifications.length === 0)
    return (
      <div>
        <Alert className="bg-yellow-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Missing Notifications</AlertTitle>
          <AlertDescription>
            No notifications found for current organization
          </AlertDescription>
        </Alert>
      </div>
    );
  return (
    <div className="flex w-full max-w-6xl flex-col space-y-5 border-[3px] border-border bg-white p-10 shadow-light">
      <h2>
        Notifications for{" "}
        <span>
          <code>{`${activeAccount.address.substring(0, 6)}...${activeAccount.address.substring(38)}`}</code>
        </span>{" "}
        :
      </h2>
      <Table>
        <TableCaption>A list of your recent notifications</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>User Address</TableHead>
            <TableHead className="text-center">Token ID</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications.map((notification, i) => (
            <TableRow key={i}>
              <TableCell>{`${notification.user_address.substring(0, 6)}...${notification.user_address.substring(38)}`}</TableCell>
              <TableCell className="text-center">
                {notification.token_id}
              </TableCell>
              <TableCell>{notification.comments}</TableCell>
              <TableCell className="text-center">
                <StatusBadge status={notification.status} />
              </TableCell>
              <TableCell className="flex w-full flex-grow space-x-3">
                {notification.status === "denied" && (
                  <Button
                    variant="noShadow"
                    className="flex flex-grow bg-red-300"
                  >
                    Delete Notification
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
