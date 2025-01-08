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
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AlertCard from "@/components/alert-card";
import LoadingStateComponent from "@/components/loading-card";
import MissingWalletComponent from "@/components/missing-wallet";

import { format } from "date-fns";

import { useToast } from "@/hooks/use-toast";
import { useGetUserRequests } from "@/hooks/access-requests/use-get-requests";
import { useDeleteRequestById } from "@/hooks/access-requests/use-delete-id-request";

import { contract } from "@/app/client";
import { revokeAccess } from "@/thirdweb/11155111/functions";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { useCreateWriteEvent } from "@/hooks/history/use-create-write-event";

function AccessControlPage() {
  const activeAccount = useActiveAccount();
  const { user } = useUser();
  const { toast } = useToast();

  const { mutateAsync: sendTransaction, status: transactionStatus } =
    useSendTransaction();

  const {
    data: requests,
    status: fetchStatus,
    error,
  } = useGetUserRequests(user?.id);

  const { mutate: deleteRequest, status: reqDelStatus } =
    useDeleteRequestById();

  const { mutate: createEvent, status: eventStatus } = useCreateWriteEvent();

  if (!activeAccount) return <MissingWalletComponent />;

  if (fetchStatus === "pending")
    return <LoadingStateComponent content="Loading requests..." />;
  if (fetchStatus === "error")
    return (
      <AlertCard
        title="Error"
        description={error.message}
        icon={<AlertCircle />}
        variant="status"
      />
    );

  if (requests.length === 0)
    return (
      <AlertCard
        title="Error"
        description="No requests approved yet"
        icon={<AlertCircle />}
        variant="status"
      />
    );

  const handleRevokeAccess = async (request: (typeof requests)[0]) => {
    try {
      const transaction = revokeAccess({
        contract,
        tokenId: BigInt(request.record.token_id),
        user: request.organization.wallet_address,
      });
      sendTransaction(transaction)
        .then((result) => {
          toast({
            title: "Success",
            description: `${result.transactionHash} for ${request.record.token_id}`,
          });
          deleteRequest({ param: { id: request.id } });
          createEvent({
            comments: `Revoked access from ${request.organization.username} for Document with Token ID ${request.record.token_id}`,
            transaction_hash: result.transactionHash,
          });
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

  const isPending = reqDelStatus === "pending" || eventStatus === "pending";

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
            <TableRow key={request.id}>
              <TableCell>{request.organization.username}</TableCell>
              <TableCell>{request.organization.wallet_address}</TableCell>
              <TableCell className="text-center">
                {request.record.token_id}
              </TableCell>
              <TableCell className="text-center">
                {request.record.title}
              </TableCell>
              <TableCell className="text-center">
                {request.processed_at === null
                  ? "Unprocessed"
                  : format(
                      new Date(request.processed_at),
                      "dd MMM, yyyy (HH:m)",
                    )}
              </TableCell>
              <TableCell className="flex flex-grow">
                <Button
                  className="w-full bg-rose-400 text-sm"
                  variant="noShadow"
                  onClick={() => handleRevokeAccess(request)}
                  disabled={isPending}
                >
                  {isPending ? "Revoking Access..." : "Revoke Access"}
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
