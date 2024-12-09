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
import React, { useState } from "react";

export default function RoleSelectionPage() {
  const { toast } = useToast();
  const [role, setRole] = useState<string>("");
  const handleSubmit = async () => {
    if (!role) {
      toast({
        title: "Error",
        description: "No role selected!",
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
