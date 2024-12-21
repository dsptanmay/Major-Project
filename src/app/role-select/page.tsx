"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/toaster";
import { userRoleEnum } from "@/db/schema_2";
import { useToast } from "@/hooks/use-toast";
import { useCreateUser } from "@/hooks/useUsers";
import { useUser } from "@clerk/nextjs";
import { Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useActiveAccount } from "thirdweb/react";

export default function RoleSelectionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const activeAccount = useActiveAccount();
  const {
    mutate: createUser,
    status,
    error: createError,
    isPending,
  } = useCreateUser();

  const [role, setRole] =
    useState<(typeof userRoleEnum.enumValues)[number]>("user");

  const handleCreateUser = () => {
    const newUser = {
      wallet_address: activeAccount!.address,
      role: role as (typeof userRoleEnum.enumValues)[number],
      username: user!.username!,
      clerk_user_id: user!.id,
    };
    try {
      createUser(newUser);
      if (status === "success") {
        toast({
          title: "Success",
          description: `Successfully created user with role ${role}`,
        });
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(createError);
      toast({ title: "Error", description: "Failed to create user" });
    }
  };

  if (!activeAccount)
    return (
      <div>
        <Alert className="bg-red-300">
          <Wallet className="h-4 w-4" />
          <AlertTitle>Missing Wallet</AlertTitle>
          <AlertDescription>Please connect your wallet first!</AlertDescription>
        </Alert>
      </div>
    );

  return (
    <div>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Select Role</CardTitle>
          <CardDescription>
            Select the role through which you want to access the website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Select
                  value={role}
                  onValueChange={(value) => {
                    setRole(value as (typeof userRoleEnum.enumValues)[number]);
                  }}
                  defaultValue="user"
                >
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="medical_organization">
                      Medical Organization
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex w-full">
          {status !== "success" && (
            <Button
              className="w-full"
              onClick={handleCreateUser}
              variant="default"
              disabled={isPending}
            >
              {status === "pending" ? "Creating User..." : "Proceed"}
            </Button>
          )}
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  );
}
