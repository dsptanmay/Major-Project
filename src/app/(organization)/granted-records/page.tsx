"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";

type OrganizationData = {
  title: string;
  token_id: string;
  description: string;
};

function GrantedRecordsPage() {
  const activeAccount = useActiveAccount();
  const [orgRecords, setOrgRecords] = useState<OrganizationData[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/org-files?orgAddress=${activeAccount!.address}`,
          { method: "GET", headers: { "Content-Type": "application/json" } },
        );
        if (response.ok) {
          const data: OrganizationData[] = await response.json();
          setOrgRecords(data);
        } else {
          setOrgRecords([]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (activeAccount) fetchData();
  }, [activeAccount]);

  const handleViewFile = (tokenId: any) => {
    router.push(`/org_view/${tokenId}`);
  };
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

  if (orgRecords.length === 0)
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
          `${activeAccount.address.substring(0, 7)}...$
          {activeAccount.address.substring(38)}`
        </code>
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orgRecords.map((record, i) => (
          <Card key={i} className="bg-[#fff4e0]">
            <CardHeader>
              <CardTitle className="text-gray-800">{record.title}</CardTitle>
              <CardDescription>{record.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/org_view/${record.token_id}`} prefetch={true}>
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
