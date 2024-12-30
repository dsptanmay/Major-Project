"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import LoadingStateComponent from "@/components/loading-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import MissingWalletComponent from "@/components/missing-wallet";

import { contract } from "@/app/client";
import { grantAccess } from "@/thirdweb/11155111/functions";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";

import {
  type UserNotification,
  useUpdateNotification,
  useUserNotifications,
} from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";
import { useUpdateRequest } from "@/hooks/useRequests";

function UserNotificationsPage() {
  const activeAccount = useActiveAccount();
  const { toast } = useToast();
  const { mutateAsync: sendTransaction, status: transactionStatus } =
    useSendTransaction();

  const {
    data: notifications,
    error,
    status,
  } = useUserNotifications(activeAccount?.address);

  const { mutate: updateNotification, isPending: isNotifUpdating } =
    useUpdateNotification();
  const { mutate: updateRequest, isPending: isReqUpdating } =
    useUpdateRequest();

  const handleApprove = async (notification: UserNotification) => {
    try {
      const transaction = grantAccess({
        contract: contract,
        tokenId: BigInt(notification.tokenId),
        user: notification.orgAddress,
      });
      sendTransaction(transaction)
        .then((result) => {
          updateNotification({
            notification_id: notification.id,
            status: "approved",
            org_address: notification.orgAddress,
          });
          updateRequest({
            org_wallet_address: notification.orgAddress,
            token_id: notification.tokenId,
            status: "approved",
          });
          toast({
            title: "Success",
            description: `Successfully granted access to $${notification.orgAddress.substring(0, 6)} (${result.transactionHash})`,
          });
        })
        .catch((err) => {
          console.error(err);
          toast({ title: "Error", description: "Failed to grant access" });
        });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: `Failed to approve request`,
      });
    }
  };
  const handleDeny = async (notification: UserNotification) => {
    try {
      updateNotification({
        notification_id: notification.id,
        org_address: notification.orgAddress,
        status: "denied",
      });
      updateRequest({
        org_wallet_address: notification.orgAddress,
        token_id: notification.tokenId,
        status: "denied",
      });
      toast({
        title: "Success",
        description: "Successfully denied request",
      });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to deny request" });
    }
  };

  if (!activeAccount) return <MissingWalletComponent />;

  if (status === "pending")
    return <LoadingStateComponent content="Loading notifications..." />;

  if (status === "error")
    return (
      <div>
        <Alert className="bg-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to fetch notifications <br /> {error.message}
          </AlertDescription>
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
    <div className="flex w-full max-w-6xl flex-col space-y-5 border-2 border-border bg-white p-5 shadow-dark">
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
            <TableHead>Message</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications.map((notification) => (
            <TableRow key={notification.id}>
              <TableCell>{notification.orgName}</TableCell>
              <TableCell>{`${notification.orgAddress.substring(0, 6)}...${notification.orgAddress.substring(38)}`}</TableCell>
              <TableCell className="text-center">
                {notification.tokenId}
              </TableCell>
              <TableCell>{notification.message}</TableCell>
              <TableCell className="flex w-full flex-grow space-x-3">
                <Button
                  variant="noShadow"
                  className="flex flex-grow bg-green-300 "
                  onClick={() => handleApprove(notification)}
                  disabled={
                    isNotifUpdating ||
                    isReqUpdating ||
                    transactionStatus === "pending"
                  }
                >
                  {transactionStatus === "pending" ||
                  isNotifUpdating ||
                  isReqUpdating
                    ? "Approving..."
                    : "Approve"}
                </Button>
                <Button
                  variant="noShadow"
                  className="flex flex-grow bg-red-300"
                  onClick={() => handleDeny(notification)}
                  disabled={isNotifUpdating || isReqUpdating}
                >
                  {transactionStatus === "pending" ||
                  isNotifUpdating ||
                  isReqUpdating
                    ? "Denying..."
                    : "Deny"}
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
