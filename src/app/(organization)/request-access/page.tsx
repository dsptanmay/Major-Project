"use client";
import React from "react";
import { useActiveAccount } from "thirdweb/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Wallet } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

export default function RequestAccessPage() {
  const { toast } = useToast();
  const formSchema = z.object({
    token_id: z.string().min(1, { message: "Must specify Token ID" }),
    comments: z
      .string()
      .min(10, { message: "Must mention reason for request" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token_id: "",
      comments: "",
    },
  });
  const activeAccount = useActiveAccount();
  const { user } = useUser();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          org_address: activeAccount?.address,
          org_name: user?.username,
          nft_token_id: values.token_id,
          comments: values.comments,
        }),
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: `Successfully sent notification for Token ID ${values.token_id}`,
        });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to send notification" });
    }
  };
  if (!activeAccount) {
    return (
      <div>
        <Alert className="bg-red-300">
          <Wallet className="h-4 w-4" />
          <AlertTitle>Missing Wallet</AlertTitle>
          <AlertDescription>Please connect your wallet first!</AlertDescription>
        </Alert>
      </div>
    );
  }
  return (
    <div
      className="flex w-full max-w-6xl flex-col space-y-5 border-[3px] border-border bg-white p-10 shadow-light"
      suppressHydrationWarning
    >
      <h2>
        Request documents from{" "}
        <span>
          <code>{`${activeAccount.address.substring(0, 6)}...${activeAccount.address.substring(38)}`}</code>
        </span>{" "}
        :
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-5 font-bold"
        >
          <FormField
            control={form.control}
            name="token_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a Token ID"
                    {...field}
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comments</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a message for the user"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" variant="noShadow">
            Submit
          </Button>
        </form>
      </Form>
      <Toaster />
    </div>
  );
}
