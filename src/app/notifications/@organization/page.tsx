"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LoadingStateComponent from "@/components/loading-card";
import MissingWalletComponent from "@/components/missing-wallet";

import { useActiveAccount } from "thirdweb/react";

import { useGetOrgNotifications } from "@/hooks/notifications/use-get-notifications";
import { useDeleteNotification } from "@/hooks/notifications/use-delete-notification";
import { useToast } from "@/hooks/use-toast";

type Notification = {
  id: string;
  message: string;
  status: "pending" | "approved" | "denied";
  token_id: string;
  record_title: string;
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

function DataTable({ data }: { data: Notification[] }) {
  const { toast } = useToast();
  const { mutate: deleteNotification, status: notifStatus } =
    useDeleteNotification();

  const handleDelete = (notification: Notification) => {
    try {
      deleteNotification({ query: { id: notification.id } });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to delete notification" });
    }
  };
  return (
    <Table>
      <TableCaption>A list of notifications you recently created</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Token ID</TableHead>
          <TableHead>Message</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((notification) => (
          <TableRow key={notification.id}>
            <TableCell>{notification.record_title}</TableCell>
            <TableCell>{notification.token_id}</TableCell>
            <TableCell>{notification.message}</TableCell>
            <TableCell className="flex justify-center">
              <StatusBadge status={notification.status} key={notification.id} />
            </TableCell>
            <TableCell className="text-center">
              {notification.status === "approved" && <>View</>}
              {notification.status === "denied" && (
                <Button
                  className="bg-rose-400"
                  variant="noShadow"
                  onClick={() => {
                    handleDelete(notification);
                  }}
                >
                  Delete Notification
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function OrgNotifications() {
  const { user } = useUser();
  const activeAccount = useActiveAccount();

  const { data, status } = useGetOrgNotifications(user?.id);

  if (!activeAccount) return <MissingWalletComponent />;
  if (status === "pending")
    return <LoadingStateComponent content="Loading notifications..." />;
  if (status === "error") return <h1>Error fetching data</h1>;

  return (
    <div className="flex w-full max-w-6xl flex-col space-y-5 border-2 border-border bg-white p-5 shadow-light">
      <h1>
        Notifications for{" "}
        <span className="font-base">
          {activeAccount.address.slice(0, 6)}...
          {activeAccount.address.slice(38)}
        </span>
      </h1>
      <DataTable data={data} />
    </div>
  );
}

export default OrgNotifications;
