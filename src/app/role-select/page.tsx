"use client";
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
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function RoleSelectionPage() {
  const { toast } = useToast();
  const [role, setRole] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { user } = useUser();
  const router = useRouter();
  const handleSubmit = async () => {
    if (!role) {
      toast({
        title: "Error",
        description: "No role selected!",
      });
    }
    try {
      const response = await fetch("/api/role", {
        method: "POST",
        body: JSON.stringify({ role, user_id: user?.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast({ title: "Success", description: "Role set successfully!" });
        router.push("/dashboard");
      } else {
        if (response.status === 409) {
          toast({
            title: "Role already assigned",
            description: "User already has a role!",
          });
          setTimeout(() => {}, 2000);
          router.push("/dashboard");
        }
        // toast({
        //   title: "Error",
        //   description: "Failed to set role. Please try again!",
        // });
      }
    } catch (err) {
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "An error occurred while setting your role!",
      });
    }
  };
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
                <Select onValueChange={(e) => setRole(e)}>
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
          <Button className="w-full" onClick={handleSubmit}>
            Proceed
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  );
}
