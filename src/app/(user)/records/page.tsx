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
import { CircleAlert, Library, Wallet } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";

interface RecordData {
  title: string;
  token_id: string;
  description: string;
}

function RecordsPageContent() {
  const [records, setRecords] = useState<RecordData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const activeAccount = useActiveAccount();
  useEffect(() => {
    const fetchRecords = async () => {
      const response = await fetch(
        `/api/user-files/?userAddress=${activeAccount!.address}`,
        { method: "GET", headers: { "Content-Type": "application/json" } },
      );
      if (response.ok) {
        const data: RecordData[] = await response.json();
        setRecords(data);
      } else if (response.status === 404) {
        setError("User has no owned NFTs");
        setRecords([]);
      } else {
        setError("Failed to fetch records!");
      }
    };
    if (activeAccount) fetchRecords();
  }, [activeAccount]);

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

  if (records.length === 0)
    return (
      <div>
        <Alert className="bg-yellow-200">
          <Library className="h-4 w-4" />
          <AlertTitle>Missing Records</AlertTitle>
          <AlertDescription>No records found for user!</AlertDescription>
        </Alert>
      </div>
    );
  return (
    <div className="flex w-full max-w-6xl flex-col space-y-5 rounded-none border-2 border-border bg-white px-10 py-10 shadow-light ">
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
