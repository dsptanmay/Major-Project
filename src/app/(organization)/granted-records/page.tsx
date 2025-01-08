"use client";

import React from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

import AlertCard from "@/components/alert-card";
import { Button } from "@/components/ui/button";
import { AlertCircle, InfoIcon } from "lucide-react";
import LoadingStateComponent from "@/components/loading-card";
import MissingWalletComponent from "@/components/missing-wallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { format } from "date-fns";

import { useActiveAccount } from "thirdweb/react";
import { useGetOrgRequests } from "@/hooks/access-requests/use-get-requests";

function GrantedRecordsPage() {
  const activeAccount = useActiveAccount();
  const { user } = useUser();

  const {
    data: grantedRecords,
    status,
    error,
  } = useGetOrgRequests(user?.id, activeAccount?.address);

  if (!activeAccount) return <MissingWalletComponent />;

  if (status === "pending")
    return <LoadingStateComponent content="Loading records..." />;
  if (status === "error")
    return (
      <AlertCard
        variant="error"
        title="Error"
        description={error.message}
        icon={<AlertCircle />}
      />
    );
  if (grantedRecords.length === 0)
    return (
      <AlertCard
        icon={<InfoIcon />}
        title="Error"
        description="No approved requests found"
        variant="status"
      />
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
        {grantedRecords.map((data) => (
          <Card key={data.id} className="bg-[#fff4e0]">
            <CardHeader>
              <CardTitle className="text-gray-800">
                {data.record.title}
              </CardTitle>
              <CardDescription>{data.record.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-5">
              <div className="flex justify-between text-sm font-base">
                <h1>{format(new Date(data.processed_at!), "dd MMM, yyyy")}</h1>
                <p>&#35;{data.record.token_id}</p>
              </div>
              <Link
                href={`/view/${data.record.token_id}`}
                prefetch={true}
                className="w-full"
              >
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
