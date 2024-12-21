"use client";
import React, { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  ExternalLink,
  SquareArrowUpRightIcon,
  Wallet,
} from "lucide-react";
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
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useOrgNotifications } from "@/hooks/useNotifications";
import LoadingStateComponent from "@/components/loading-card";

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
  const { toast } = useToast();

  const {
    data: notifications,
    status,
    error,
  } = useOrgNotifications(activeAccount?.address);

  // const handleDelete = async (notification: any) => {
  //   try {
  //     const response = await fetch(
  //       `/api/notifications?orgAddress=${activeAccount!.address}&userAddress=${notification.user_address}&tokenId=${notification.token_id}`,
  //       {
  //         method: "DELETE",
  //         headers: { "Content-Type": "application/json" },
  //       },
  //     );

  //     if (response.ok) {
  //       toast({
  //         title: "Success",
  //         description: "Notification deleted successfully",
  //       });
  //       setNotifications((prevNotifs) =>
  //         prevNotifs.filter((n) => n != notification),
  //       );
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed in deleteing notification",
  //     });
  //     console.error(error);
  //   }
  // };

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

  if (status === "pending")
    return <LoadingStateComponent content="Loading notifications..." />;

  if (status === "error")
    return (
      <div>
        <Alert className="bg-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            An error occurred while fetching notifications <br />{" "}
            {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );

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
            <TableHead className="text-center">Token ID</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications.map((notification, i) => (
            <TableRow key={i}>
              <TableCell className="text-center">
                {notification.tokenId}
              </TableCell>
              <TableCell>{notification.message}</TableCell>
              <TableCell className="text-center">
                <StatusBadge status={notification.status} />
              </TableCell>
              <TableCell className="flex w-full flex-grow space-x-3">
                {notification.status === "denied" && (
                  <div className="flex w-full justify-center">
                    <Button
                      variant="noShadow"
                      className="bg-red-300"
                      onClick={() => {}}
                    >
                      Delete Notification
                    </Button>
                  </div>
                )}
                {notification.status === "approved" && (
                  <Link
                    href={`/org_view/${notification.tokenId}`}
                    prefetch={true}
                    className="flex h-full w-full flex-col items-center justify-between"
                  >
                    <Badge className="bg-orange-300 px-3 py-2 font-semibold text-black">
                      View
                    </Badge>
                  </Link>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Toaster />
    </div>
  );
}
