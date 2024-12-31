"use client";
import React from "react";
import Link from "next/link";

import { useActiveAccount } from "thirdweb/react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LoadingStateComponent from "@/components/loading-card";
import MissingWalletComponent from "@/components/missing-wallet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  OrgNotification,
  useDeleteNotification,
} from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";
import { useGetOrgNotifications } from "@/hooks/notifications/use-get-notifications";

import { useUser } from "@clerk/nextjs";

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
  const { user } = useUser();
  const { toast } = useToast();

  const {
    mutate: deleteNotification,
    status: deleteStatus,
    error: deleteError,
    isPending: deletePending,
  } = useDeleteNotification();

  const {
    data: notifications,
    status: fetchStatus,
    error: fetchError,
  } = useGetOrgNotifications(user?.id);

  const handleDelete = async (notification: OrgNotification) => {
    try {
      deleteNotification({
        notification_id: notification.id,
        org_address: activeAccount!.address,
      });
      if (deleteStatus === "success")
        toast({
          title: "Success",
          description: "Deleted notification successfully!",
        });
    } catch (error) {
      console.error(error, deleteError?.message);

      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  if (!activeAccount) {
    return <MissingWalletComponent />;
  }

  if (fetchStatus === "pending")
    return <LoadingStateComponent content="Loading notifications..." />;

  if (fetchStatus === "error")
    return (
      <div>
        <Alert className="bg-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            An error occurred while fetching notifications <br />{" "}
            {fetchError.message}
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
            <TableHead>Title</TableHead>
            <TableHead>Token ID</TableHead>
            <TableHead>Message</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications.map((notification) => (
            <TableRow key={notification.id}>
              <TableCell>{notification.record_title}</TableCell>
              <TableCell>{notification.token_id}</TableCell>
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
                      {deletePending
                        ? "Deleting Notification..."
                        : "Delete Notification"}
                    </Button>
                  </div>
                )}
                {notification.status === "approved" && (
                  <Link
                    href={`/view/${notification.token_id}`}
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
    </div>
  );
}
