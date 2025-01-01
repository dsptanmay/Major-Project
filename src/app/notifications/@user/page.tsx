"use client";

import React from "react";

import { useUser } from "@clerk/nextjs";

import { useActiveAccount } from "thirdweb/react";

import MissingWalletComponent from "@/components/missing-wallet";
import LoadingStateComponent from "@/components/loading-card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEditNotification } from "@/hooks/notifications/use-edit-notification";
import { useGetUserNotifications } from "@/hooks/notifications/use-get-notifications";
import { Button } from "@/components/ui/button";

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
              >
                Grant
              </Button>
              <Button variant="noShadow" className="flex flex-grow bg-rose-400">
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
