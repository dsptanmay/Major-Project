"use client";
import { contract } from "@/app/client";
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
import { CircleAlert, Wallet } from "lucide-react";
import React, { useEffect, useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";

type RecordData = {
  organization_name: string;
  organization_address: string;
  token_id: string;
  title: string;
};

function AccessControlPage() {
  const { toast } = useToast();
  const activeAccount = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();
  const [records, setRecords] = useState<RecordData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `/api/access?userAddress=${activeAccount!.address}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (response.ok) {
        const data: RecordData[] = await response.json();
        setRecords(data);
      } else {
        setRecords([]);
      }
    };
    if (activeAccount) fetchData();
  });

  const handleRevokeAccess = async (record: RecordData) => {
    try {
      const transaction = prepareContractCall({
        contract,
        method: "function revokeAccess(uint256 tokenId, address user)",
        params: [BigInt(record.token_id), record.organization_address],
      });
      sendTransaction(transaction);
      const response = await fetch(
        `/api/access?orgName=${record.organization_name}&tokenId=${record.token_id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (response.ok) {
        toast({
          title: "Success",
          description: `Successfully revoked access for token id ${record.token_id}`,
        });
        setRecords((prev) => prev.filter((n) => n != record));
      } else {
        toast({
          title: "Error",
          description: "Failed to revoke access for record",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
  if (!activeAccount)
    return (
      <div>
        <Alert className="bg-red-300">
          <Wallet className="h-4 w-4" />
          <AlertTitle>Missing Wallet</AlertTitle>
          <AlertDescription>Please connect your wallet first!</AlertDescription>
        </Alert>
      </div>
    );

  if (records.length === 0)
    return (
      <div>
        <Alert className="bg-yellow-200">
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>No Records</AlertTitle>
          <AlertDescription>
            No granted records found for current user!
          </AlertDescription>
        </Alert>
      </div>
    );
  return (
    <div className="flex w-full max-w-6xl flex-col space-y-5 border-[3px] border-border bg-white p-5 shadow-light">
      <h2>
        Documents granted by{" "}
        <code>
          {`${activeAccount.address.substring(0, 6)}...${activeAccount.address.substring(38)}`}
          :
        </code>
      </h2>
      <Table>
        <TableCaption>
          A list of documents that you have granted to organizations
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Org Name</TableHead>
            <TableHead>Org Address</TableHead>
            <TableHead className="text-center">Token ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record, i) => (
            <TableRow key={i}>
              <TableCell>{record.organization_name}</TableCell>
              <TableCell>{record.organization_address}</TableCell>
              <TableCell className="text-center">{record.token_id}</TableCell>
              <TableCell>{record.title}</TableCell>
              <TableCell className="flex flex-grow">
                <Button
                  className="flex flex-grow bg-red-300"
                  variant="noShadow"
                  onClick={() => handleRevokeAccess(record)}
                >
                  Revoke Access
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

export default AccessControlPage;
