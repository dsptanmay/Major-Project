"use client";
import { contract } from "@/app/client";
import LoadingStateComponent from "@/components/loading-card";
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
import {
  UserNotification,
  useUpdateNotification,
  useUserNotifications,
} from "@/hooks/useNotifications";
import { AlertCircle, Wallet as WalletIcon } from "lucide-react";
import React from "react";
import { prepareContractCall } from "thirdweb";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";

function UserNotificationsPage() {
  const activeAccount = useActiveAccount();
  const { toast } = useToast();
  const { mutate: sendTransaction } = useSendTransaction();

  const {
    data: notifications,
    error,
    status,
  } = useUserNotifications(activeAccount?.address);

  const { mutate: updateNotification, isPending: isUpdating } =
    useUpdateNotification();

  const handleApprove = async (notification: UserNotification) => {
    try {
      updateNotification({
        notification_id: notification.id,
        status: "approved",
        orgAddress: notification.orgAddress,
      });

      //TODO: add updateRequest here as well

      const transaction = prepareContractCall({
        contract,
        method: "function grantAccess(uint256 tokenId, address user)",
        params: [BigInt(notification.tokenId), notification.orgAddress],
      });
      sendTransaction(transaction);

      toast({
        title: "Success",
        description: `Successfully granted access to ${notification.orgAddress.substring(0, 6)} for Token ID ${notification.tokenId}`,
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
        orgAddress: notification.orgAddress,
        status: "denied",
      });

      //TODO: add updateRequest here as well
      toast({
        title: "Success",
        description: "Successfully denied request",
      });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to deny request" });
    }
  };

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
                  disabled={isUpdating}
                >
                  Approve
                </Button>
                <Button
                  variant="noShadow"
                  className="flex flex-grow bg-red-300"
                  onClick={() => handleDeny(notification)}
                  disabled={isUpdating}
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
