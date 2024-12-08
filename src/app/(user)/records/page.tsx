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
import { Wallet } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useActiveAccount } from "thirdweb/react";

function RecordsPageContent() {
  const activeAccount = useActiveAccount();
  const data = [
    {
      token_id: 1,
      title: "Title",
      description: "description",
    },
    {
      token_id: 1,
      title: "Title",
      description: "description",
    },
    {
      token_id: 1,
      title: "Title",
      description: "description",
    },
    {
      token_id: 1,
      title: "Title",
      description: "description",
    },
    {
      token_id: 1,
      title: "Title",
      description: "description",
    },
    {
      token_id: 1,
      title: "Title",
      description: "description",
    },
    {
      token_id: 1,
      title: "Title",
      description: "description",
    },
    {
      token_id: 1,
      title: "Title",
      description: "description",
    },
    {
      token_id: 1,
      title: "Title",
      description: "description",
    },
    {
      token_id: 1,
      title: "Title",
      description: "description",
    },
  ];
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
  return (
    <div className="flex w-full max-w-6xl flex-col space-y-5 rounded-none border-2 border-border bg-white px-10 py-10 shadow-light ">
      <h2>
        NFTs owned by{" "}
        <span>
          <code>{`${activeAccount.address.substring(0, 6)}...${activeAccount.address.substring(38)}`}</code>
        </span>{" "}
        :
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((record, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{record.title}</CardTitle>
              <CardDescription>{record.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/view/${record.token_id}`}>
                <Button>View Document</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default RecordsPageContent;
