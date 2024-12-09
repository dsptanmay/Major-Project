"use client";
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
import { Wallet } from "lucide-react";
import React from "react";
import { useActiveAccount } from "thirdweb/react";

const sampleData: RecordData[] = [
  {
    organization_name: "health_organization",
    organization_address: "0x12321214124124",
    token_id: "1",
    comments: "Hello There",
  },
];

type RecordData = {
  organization_name: string;
  organization_address: string;
  token_id: string;
  comments: string;
};

function UserNotificationsPage() {
  const activeAccount = useActiveAccount();

  const handleApprove = (record: RecordData) => {
    console.log(`Token ID: ${record.token_id}`);
  };

  if (!activeAccount)
    return (
      <div className="">
        <Alert className="bg-red-300">
          <Wallet className="h-4 w-4" />
          <AlertTitle>Missing crypto wallet</AlertTitle>
          <AlertDescription>Please connect your wallet first!</AlertDescription>
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
            <TableHead>Comments</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...sampleData, ...sampleData, ...sampleData].map((record, i) => (
            <TableRow key={i}>
              <TableCell>{record.organization_name}</TableCell>
              <TableCell>{record.organization_address}</TableCell>
              <TableCell className="text-center">{record.token_id}</TableCell>
              <TableCell>{record.comments}</TableCell>
              <TableCell className="flex w-full flex-grow space-x-3">
                <Button
                  variant="noShadow"
                  className="flex flex-grow bg-green-300 "
                  onClick={() => handleApprove(record)}
                >
                  Approve
                </Button>
                <Button
                  variant="noShadow"
                  className="flex flex-grow bg-red-300"
                >
                  Deny
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default UserNotificationsPage;
