"use client";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import LoadingStateComponent from "@/components/loading-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useUser } from "@clerk/nextjs";

import { useGetUser } from "@/hooks/users/use-get-user";

function ProfilePage() {
  const { user } = useUser();
  const { data: userData, status } = useGetUser(user?.id);

  const formatTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const units = [
      { name: "year", seconds: 31536000 },
      { name: "month", seconds: 2592000 },
      { name: "week", seconds: 604800 },
      { name: "day", seconds: 86400 },
      { name: "hour", seconds: 3600 },
      { name: "minute", seconds: 60 },
    ];

    for (const unit of units) {
      const value = Math.floor(diffInSeconds / unit.seconds);
      if (value > 0) {
        return `${value} ${unit.name}${value > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  };

  if (status === "pending")
    return <LoadingStateComponent content="Loading Profile..." />;

  if (status === "error")
    return (
      <div>
        <Alert className="bg-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>User not found!</AlertDescription>
        </Alert>
      </div>
    );

  return (
    <div className="flex w-full max-w-md flex-col rounded-base border-2 border-border bg-white p-5 shadow-light">
      <Card className="bg-[#fff4e0] shadow-none">
        <CardHeader>
          <CardTitle className="flex flex-col items-center space-y-4 ">
            <span>{userData.username}</span>
            <Badge className="bg-[#fd9745] text-base font-semibold">
              {userData.role}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-800">Wallet Address:</span>
              <span className="font-mono">
                {userData.wallet_address.slice(0, 6)}...
                {userData.wallet_address.slice(-4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-800">Member Since:</span>
              <span>{formatTimeSince(userData.created_at.toString())}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfilePage;
