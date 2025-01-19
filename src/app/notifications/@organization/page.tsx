"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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

import { useToast } from "@/hooks/use-toast";
import { useActiveAccount } from "thirdweb/react";

import {
  type OrgNotifications,
  useGetOrgNotifications,
} from "@/hooks/notifications/use-get-notifications";
import { useDeleteNotification } from "@/hooks/notifications/use-delete-notification";

import { useDeleteRequest } from "@/hooks/access-requests/use-delete-org-request";

const StatusBadge: React.FC<{ status: "approved" | "pending" | "denied" }> = ({
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

function DataTable({ data }: { data: OrgNotifications }) {
  const { toast } = useToast();
  const { user } = useUser();
  const { mutate: deleteNotification, status: notifStatus } =
    useDeleteNotification();
  const { mutate: deleteRequest, status: reqStatus } = useDeleteRequest();
  const router = useRouter();

  const isPending = notifStatus === "pending" || reqStatus === "pending";

  const handleDelete = (notification: OrgNotifications[0]) => {
    try {
      deleteNotification({ param: { id: notification.id } });
      deleteRequest({
        query: { org_id: user?.id, token_id: notification.record.token_id },
      });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to delete notification" });
    }
  };

  return (
    <Table>
      <TableCaption>A list of requests you recently created</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead className="text-center">Token ID</TableHead>
          <TableHead>Message</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((notification) => (
          <TableRow key={notification.id}>
            <TableCell>{notification.record.title}</TableCell>
            <TableCell className="flex justify-center">
              {notification.record.token_id}
            </TableCell>
            <TableCell>{notification.message}</TableCell>
            <TableCell className="flex justify-center">
              <StatusBadge status={notification.status} key={notification.id} />
            </TableCell>
            <TableCell className="flex flex-col items-center text-center">
              {notification.status === "approved" && (
                <Button
                  className="bg-[#fa9e53]"
                  variant="noShadow"
                  onClick={() => {
                    router.push(`/view/${notification.record.token_id}`);
                  }}
                >
                  View Document
                </Button>
              )}
              {notification.status === "denied" && (
                <Button
                  className="bg-rose-400"
                  variant="noShadow"
                  disabled={isPending}
                  onClick={() => {
                    handleDelete(notification);
                  }}
                  key={notification.id}
                >
                  {isPending ? "Deleting..." : "Delete Notification"}
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function OrgNotificationsPage() {
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
        :
      </h1>
      <DataTable data={data} />
    </div>
  );
}

export default OrgNotificationsPage;
