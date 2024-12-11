"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Wallet } from "lucide-react";
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
  });

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
  return (
    <div className="flex w-full max-w-6xl flex-col space-y-5 rounded-none border-[3px] border-border bg-white p-5 shadow-light">
      <h2>
        Granted documents for{" "}
        <code>
          `${activeAccount.address.substring(0, 7)}...$
          {activeAccount.address.substring(38)}`
        </code>
      </h2>
    </div>
  );
}

export default GrantedRecordsPage;
