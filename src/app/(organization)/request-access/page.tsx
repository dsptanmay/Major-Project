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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircleIcon, CheckIcon, Wallet } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useActiveAccount } from "thirdweb/react";

import { useToast } from "@/hooks/use-toast";
import { useCreateRequest } from "@/hooks/access-requests/use-create-request";
import { useCreateNotification } from "@/hooks/notifications/use-create-notification";
import MissingWalletComponent from "@/components/missing-wallet";

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
    mutateAsync: createNotification,
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
      }).then(() => {
        createRequest({
          token_id: values.token_id,
        });
      });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to send request" });
    }
  };
  if (!activeAccount) {
    return <MissingWalletComponent />;
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
