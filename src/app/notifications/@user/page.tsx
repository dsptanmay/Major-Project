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
import { Button } from "@/components/ui/button";
import LoadingStateComponent from "@/components/loading-card";
import MissingWalletComponent from "@/components/missing-wallet";

import { useToast } from "@/hooks/use-toast";
import { useEditRequest } from "@/hooks/access-requests/use-edit-request";
import { useEditNotification } from "@/hooks/notifications/use-edit-notification";
import { useGetUserNotifications } from "@/hooks/notifications/use-get-notifications";

import { contract } from "@/app/client";
import { grantAccess } from "@/thirdweb/11155111/functions";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";

function DataTable({
  data,
}: {
  data: {
    id: string;
    message: string;
    token_id: string;
    org_username: string;
    org_wallet_address: string;
  }[];
}) {
  const { toast } = useToast();

  const { mutateAsync: sendTransaction, status: transactionStatus } =
    useSendTransaction();

  const { mutate: updateNotification, status: notifStatus } =
    useEditNotification();
  const { mutate: updateRequest, status: requestStatus } = useEditRequest();

  const isPending =
    transactionStatus === "pending" ||
    requestStatus === "pending" ||
    notifStatus === "pending";

  const handleApprove = (notification: (typeof data)[0]) => {
    try {
      const transaction = grantAccess({
        contract: contract,
        tokenId: BigInt(notification.token_id),
        user: notification.org_wallet_address,
      });
      sendTransaction(transaction).then((result) => {
        updateNotification({ id: notification.id, status: "approved" });
        updateRequest({
          status: "approved",
          token_id: notification.token_id,
          org_name: notification.org_username,
        });
        toast({ title: "Success", description: `${result.transactionHash}` });
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to approve request",
        variant: "destructive",
      });
    }
  };
  const handleDeny = (notification: (typeof data)[0]) => {
    try {
      updateNotification({ id: notification.id, status: "denied" });
      updateRequest({
        status: "denied",
        token_id: notification.token_id,
        org_name: notification.org_username,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to deny request",
        variant: "destructive",
      });
    }
  };

  return (
    <Table>
      <TableCaption>A list of your recent notifications</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Org Name</TableHead>
          <TableHead>Org Address</TableHead>
          <TableHead className="text-center">Token ID</TableHead>
          <TableHead>Message</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((notification) => (
          <TableRow key={notification.id}>
            <TableCell>{notification.org_username}</TableCell>
            <TableCell>
              {notification.org_wallet_address.slice(0, 6)}...
              {notification.org_wallet_address.slice(38)}
            </TableCell>
            <TableCell className="text-center">
              {notification.token_id}
            </TableCell>
            <TableCell>{notification.message}</TableCell>
            <TableCell className="flex w-full flex-grow space-x-3">
              <Button
                variant="noShadow"
                className="flex flex-grow bg-green-300"
                disabled={isPending}
                onClick={() => handleApprove(notification)}
              >
                {transactionStatus === "pending" ? "Granting..." : "Grant"}
              </Button>
              <Button
                variant="noShadow"
                className="flex flex-grow bg-rose-400"
                disabled={isPending}
                onClick={() => handleDeny(notification)}
              >
                Deny
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function UserNotifications() {
  const { user } = useUser();
  const activeAccount = useActiveAccount();
  const {
    data: notifications,
    status: fetchStatus,
    error,
  } = useGetUserNotifications(user?.id);

  if (!activeAccount) return <MissingWalletComponent />;
  if (fetchStatus === "pending")
    return <LoadingStateComponent content="Loading notifications..." />;
  if (fetchStatus === "error") return <h1>Error</h1>; // TODO add a proper Error component
  return (
    <div className="flex w-full max-w-6xl flex-col space-y-5 border-2 border-border bg-white p-5 shadow-light">
      <h1>
        Notifications for{" "}
        <span className="font-heading">
          {activeAccount.address.slice(0, 6)}...
          {activeAccount.address.slice(38)}
        </span>
        :
      </h1>
      <DataTable data={notifications} />
    </div>
  );
}

export default UserNotifications;
