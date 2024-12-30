"use client";
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
import { AlertCircle } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import React from "react";

import { format } from "date-fns";

import { useToast } from "@/hooks/use-toast";
import { useDeleteRequest, useGetRequestsUser } from "@/hooks/useRequests";

import { contract } from "@/app/client";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { revokeAccess } from "@/thirdweb/11155111/functions";
import MissingWalletComponent from "@/components/missing-wallet";

function AccessControlPage() {
  const activeAccount = useActiveAccount();
  const { toast } = useToast();
  const { mutateAsync: sendTransaction, status: transactionStatus } =
    useSendTransaction();
  const {
    data: requests,
    status,
    error,
  } = useGetRequestsUser(activeAccount?.address);
  const { mutate: deleteRequest, isPending: reqDeletePending } =
    useDeleteRequest();

  if (!activeAccount) return <MissingWalletComponent />;

  if (status === "pending")
    return <LoadingStateComponent content="Loading requests..." />;
  if (status === "error")
    return (
      <div>
        <Alert className="bg-rose-400">
          <AlertCircle className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    );

  if (requests.length === 0)
    return (
      <div>
        <Alert className="bg-yellow-200">
          <AlertCircle className="size-4" />
          <AlertTitle>Missing Records</AlertTitle>
          <AlertDescription>You have granted no documents!</AlertDescription>
        </Alert>
      </div>
    );

  const handleRevokeAccess = async (request: (typeof requests)[0]) => {
    try {
      const transaction = revokeAccess({
        contract,
        tokenId: BigInt(request.recordTokenId),
        user: request.organizationWallet,
      });
      sendTransaction(transaction)
        .then((result) => {
          toast({
            title: "Success",
            description: `${result.transactionHash} for ${request.recordTokenId}`,
          });
          deleteRequest({ request_id: request.requestId });
        })
        .catch((err) => {
          console.error(err);
          toast({ title: "Error", description: "Failed to revoke access!" });
        });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "An error occurred!" });
    }
  };

  return (
    <div className="flex w-full max-w-6xl flex-col space-y-5 border-2 border-border bg-white p-5 shadow-light">
      <h2>
        Documents granted by{" "}
        <code>{`${activeAccount.address.slice(0, 6)}...${activeAccount.address.slice(38)}`}</code>
        :
      </h2>
      <Table>
        <TableCaption>
          A list of documents you have granted to organizations
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Org Name</TableHead>
            <TableHead>Org Address</TableHead>
            <TableHead className="text-center">Token ID</TableHead>
            <TableHead className="text-center">Title</TableHead>
            <TableHead className="text-center">Date Processed</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.requestId}>
              <TableCell>{request.organizationName}</TableCell>
              <TableCell>{request.organizationWallet}</TableCell>
              <TableCell className="text-center">
                {request.recordTokenId}
              </TableCell>
              <TableCell className="text-center">
                {request.recordTitle}
              </TableCell>
              <TableCell className="text-center">
                {request.processedAt === null
                  ? "Unprocessed"
                  : format(
                      new Date(request.processedAt),
                      "dd MMM, yyyy (HH:m)",
                    )}
              </TableCell>
              <TableCell className="flex flex-grow">
                <Button
                  className="w-full bg-rose-400 text-sm"
                  variant="noShadow"
                  onClick={() => handleRevokeAccess(request)}
                  disabled={reqDeletePending || transactionStatus === "pending"}
                >
                  {reqDeletePending || transactionStatus === "pending"
                    ? "Revoking Access..."
                    : "Revoke Access"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default AccessControlPage;
