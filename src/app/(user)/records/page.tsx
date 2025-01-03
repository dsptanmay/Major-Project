"use client";
import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AlertCard from "@/components/alert-card";
import LoadingStateComponent from "@/components/loading-card";
import MissingWalletComponent from "@/components/missing-wallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useActiveAccount } from "thirdweb/react";
import { useGetRecords } from "@/hooks/medical-records/use-get-records";

function RecordsPageContent() {
  const activeAccount = useActiveAccount();
  const { user } = useUser();
  const {
    data: records,
    status,
    error,
  } = useGetRecords(user?.id, activeAccount?.address);

  if (!activeAccount) return <MissingWalletComponent />;

  if (status === "pending")
    return <LoadingStateComponent content="Loading records..." />;
  if (status === "error")
    return (
      <AlertCard
        icon={<AlertCircle />}
        title="Error"
        description={error.message}
        variant="error"
      />
    );

  if (records.length === 0)
    return (
      <AlertCard
        icon={<AlertCircle />}
        title="Error"
        description="No Records found for user"
        variant="status"
      />
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {records.map((record, i) => (
          <Card key={i} className="bg-[#fff4e0]">
            <CardHeader>
              <CardTitle className="text-gray-800">{record.title}</CardTitle>
              <CardDescription>{record.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex w-full flex-col space-y-5">
              <div className="flex justify-between text-sm font-base">
                <h1>{format(record.uploaded_at, "dd MMM, yyyy")}</h1>
                <h2>#{record.token_id}</h2>
              </div>
              <Link href={`/view/${record.token_id}`}>
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
