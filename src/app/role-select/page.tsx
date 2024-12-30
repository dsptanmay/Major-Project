"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import MissingWalletComponent from "@/components/missing-wallet";
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

import { useUser } from "@clerk/nextjs";
import { userRoleEnum } from "@/db/schema";

import { useToast } from "@/hooks/use-toast";
import { useCreateUser } from "@/hooks/users/use-create-user";

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
    if (!user?.username) return;
    const newUser = {
      wallet_address: activeAccount!.address,
      role: role,
      username: user.username,
      created_at: new Date(),
    };
    try {
      createUser(newUser);
      if (status === "success") {
        toast({
          title: "Success",
          description: `Successfully created user with role ${role}`,
          duration: 1500,
        });
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (error) {
      console.error(createError);
      toast({ title: "Error", description: "Failed to create user" });
    }
  };

  if (!activeAccount) return <MissingWalletComponent />;

  return (
    <div>
      <Card className="w-[350px] bg-[#fff4e0]">
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
              className="w-full bg-[#fd9745]"
              onClick={handleCreateUser}
              variant="default"
              disabled={isPending}
            >
              {status === "pending" ? "Creating User..." : "Proceed"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
