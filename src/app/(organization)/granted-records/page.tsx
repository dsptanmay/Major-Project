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
import { useGetRequests } from "@/hooks/useRequests";
import { AlertCircle, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";

type OrganizationData = {
  requestId: string;
  recordTitle: string;
  recordDescription: string;
  recordTokenId: string;
  requestedAt: string;
  processedAt: string;
};

function GrantedRecordsPage() {
  const activeAccount = useActiveAccount();

  const {
    data: orgRequests,
    status,
    error,
  } = useGetRequests(activeAccount?.address);

  if (!activeAccount)
    return (
      <div>
        <Alert>
          <Wallet className="h-4 w-4" />
          <AlertTitle>Missing Wallet</AlertTitle>
          <AlertDescription>Please connect your wallet first!</AlertDescription>
        </Alert>
      </div>
    );

  if (status === "pending")
    return <LoadingStateComponent content="Loading records..." />;
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
  if (orgRequests.length === 0)
    return (
      <div>
        <Alert className="bg-yellow-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Missing Records</AlertTitle>
          <AlertDescription>
            Organization has no granted documents
          </AlertDescription>
        </Alert>
      </div>
    );
  return (
    <div className="flex w-full max-w-6xl flex-col space-y-5 rounded-base border-[3px] border-border bg-white p-5 shadow-light">
      <h2>
        Granted documents for{" "}
        <code>
          {activeAccount.address.substring(0, 7)}...
          {activeAccount.address.substring(38)}:
        </code>
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orgRequests.map((record) => (
          <Card key={record.requestId} className="bg-[#fff4e0]">
            <CardHeader>
              <CardTitle className="text-gray-800">
                {record.recordTitle}
              </CardTitle>
              <CardDescription>{record.recordDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/org_view/${record.recordTokenId}`} prefetch={true}>
                <Button className="w-full bg-[#fd9745]">View Document</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default GrantedRecordsPage;
