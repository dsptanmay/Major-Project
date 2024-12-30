"use client";
import React from "react";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import { AlertCircleIcon, CheckIcon, Wallet } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useCreateRequest } from "@/hooks/useRequests";

import { useActiveAccount } from "thirdweb/react";
import { useCreateNotification } from "@/hooks/useNotifications";

export default function RequestAccessPage() {
  const { toast } = useToast();
  const formSchema = z.object({
    token_id: z.string().min(1, { message: "Must specify Token ID" }),
    comments: z
      .string()
      .min(10, { message: "Must mention reason for request" }),
  });
  const {
    mutate: createRequest,
    status: createRequestStatus,
    error: createRequestError,
  } = useCreateRequest();
  const {
    mutate: createNotification,
    status: createNotifStatus,
    error: createNotifError,
  } = useCreateNotification();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token_id: "",
      comments: "",
    },
  });
  const activeAccount = useActiveAccount();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      createNotification({
        token_id: values.token_id,
        message: values.comments,
        org_wallet_address: activeAccount!.address,
      });
      createRequest({
        token_id: values.token_id,
        org_wallet_address: activeAccount!.address,
      });
      if (createRequestStatus === "success" && createNotifStatus === "success")
        toast({
          title: "Success",
          description: `Successfully requested access for Token ID ${values.token_id}`,
        });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to send request" });
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
      className="flex w-full max-w-6xl flex-col space-y-5 border-[3px] border-border bg-white px-10 py-10 shadow-light"
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
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {createNotifStatus !== "success" &&
            createRequestStatus !== "success" && (
              <Button type="submit" className="w-full" variant="noShadow">
                {createRequestStatus === "pending" ||
                createNotifStatus === "pending"
                  ? "Creating Request..."
                  : "Submit"}
              </Button>
            )}
        </form>
      </Form>
      {createNotifStatus === "success" && createRequestStatus === "success" && (
        <Alert className="bg-green-300">
          <CheckIcon className="size-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Successfully requested access for document
          </AlertDescription>
        </Alert>
      )}
      {createRequestStatus === "error" && (
        <Alert>
          <AlertCircleIcon className="size-4" />
          <AlertTitle>Failed to request access</AlertTitle>
          <AlertDescription>{createRequestError.message}</AlertDescription>
        </Alert>
      )}
      {createNotifStatus === "error" && (
        <Alert>
          <AlertCircleIcon className="size-4" />
          <AlertTitle>Failed to send notification</AlertTitle>
          <AlertDescription>{createNotifError.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
