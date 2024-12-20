"use client";
import LoadingStateComponent from "@/components/loading-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetRecords } from "@/hooks/useRecords";
import {
  AlertCircle,
  CircleAlert,
  InfoIcon,
  Library,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";

interface RecordData {
  title: string;
  token_id: string;
  description: string;
}

function RecordsPageContent() {
  const activeAccount = useActiveAccount();
  const {
    data: records,
    status,
    error,
  } = useGetRecords(activeAccount?.address);

  if (!activeAccount)
    return (
      <div>
        <Alert className="bg-red-300">
          <Wallet className="h-4 w-4" />
          <AlertTitle>Missing Crypto Wallet</AlertTitle>
          <AlertDescription>Please connect your wallet first!</AlertDescription>
        </Alert>
      </div>
    );

  if (status === "pending")
    return <LoadingStateComponent content="Loading records..." />;
  if (status === "error")
    return (
      <div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to fetch records. <br />
            {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );

  if (records.length === 0)
    return (
      <div>
        <Alert>
          <Library className="h-4 w-4" />
          <InfoIcon>Missing Records</InfoIcon>
          <AlertDescription>No records found for user!</AlertDescription>
        </Alert>
      </div>
    );
  return (
    <div className="flex w-full max-w-6xl flex-col space-y-5 rounded-base border-2 border-border bg-white px-10 py-10 shadow-light ">
      <h2>
        NFTs owned by{" "}
        <span>
          <code>{`${activeAccount.address.substring(0, 6)}...${activeAccount.address.substring(38)}`}</code>
        </span>{" "}
        :
      </h2>
      {error && (
        <Alert className="bg-red-300">
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>An Error Occurred!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {records.map((record, i) => (
          <Card key={i} className="bg-[#fff4e0]">
            <CardHeader>
              <CardTitle className="text-gray-800">{record.title}</CardTitle>
              <CardDescription>{record.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/user_view/${record.token_id}`} prefetch={true}>
                <Button className="w-full bg-[#fd9745]">View Document</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default RecordsPageContent;
