"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import MissingWalletComponent from "@/components/missing-wallet";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircleIcon } from "lucide-react";

import { useCreateRecord, useGetTokenID } from "@/hooks/useRecords";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { mintNFT } from "@/thirdweb/11155111/functions";
import { client, contract } from "@/app/client";
import { upload } from "thirdweb/storage";

import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  file: z.instanceof(File).refine((file) => {
    return file && file.type === "application/pdf";
  }, "File must be a PDF"),
});

type FormValues = z.infer<typeof formSchema>;

function UserUploadPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  const { toast } = useToast();
  const {
    mutateAsync: sendTransaction,
    status: transactionStatus,
    data: transactionResult,
  } = useSendTransaction();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const activeAccount = useActiveAccount();

  const {
    mutate: createRecord,
    status: createRecordStatus,
    error: createError,
  } = useCreateRecord();
  const tokenQuery = useGetTokenID();

  const handleEncryptionAndUpload = async (file: File) => {
    if (!file) return { encryption_key: null, ipfs_link: null };

    try {
      const forge = await import("node-forge");
      const fileBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(fileBuffer);

      const key = forge.random.getBytesSync(32);
      const initial_value = forge.random.getBytesSync(16);

      const cipher = forge.cipher.createCipher("AES-CBC", key);
      cipher.start({ iv: initial_value });

      cipher.update(forge.util.createBuffer(uint8Array));
      cipher.finish();

      const encryptedFile = cipher.output;

      const encryptedData = {
        iv: forge.util.bytesToHex(initial_value),
        encryptedContent: encryptedFile.toHex(),
        originalName: file.name,
      };

      const encryptedBlob = new Blob([JSON.stringify(encryptedData)], {
        type: "application/json",
      });

      const encryptedJson = new File(
        [encryptedBlob],
        `${file.name}.encrypted.json`,
        { type: "application/json" },
      );

      const uri = await upload({ client: client, files: [encryptedJson] });
      return { encryption_key: forge.util.bytesToHex(key), ipfs_link: uri };
    } catch (err) {
      console.error(err);
      return { encryption_key: null, ipfs_link: null };
    }
  };

  const handleMintNFT = async (formData: FormValues) => {
    setIsProcessing(true);
    const { data: tokenId } = await tokenQuery.refetch();
    const { encryption_key, ipfs_link } = await handleEncryptionAndUpload(
      formData.file,
    );
    if (!tokenId) return;
    if (encryption_key && ipfs_link) {
      try {
        const uploadData = {
          wallet_address: activeAccount!.address,
          token_id: tokenId.toString(),
          encryption_key: encryption_key,
          title: formData.title,
          description: formData.description,
        };
        const transaction = mintNFT({
          contract: contract,
          ipfsHash: ipfs_link,
          to: activeAccount!.address,
        });
        sendTransaction(transaction)
          .then((result) => {
            toast({
              title: "Success",
              description: "Minted NFT successfully",
            });
            createRecord(uploadData);
            setIsProcessing(false);
          })
          .catch((err) => {
            console.error(err);
            toast({ title: "Error", description: "Failed to Mint NFT" });
          })
          .finally(() => {
            setIsProcessing(false);
          });
      } catch (error) {
        console.error(error);
        setIsProcessing(false);
        form.reset();
      }
    } else {
      toast({
        title: "Error",
        description: "Failed to encrypt and upload file",
      });
      setIsProcessing(false);
      form.reset();
    }
  };

  if (!activeAccount) return <MissingWalletComponent />;

  return (
    <div className="flex w-full max-w-6xl flex-col space-y-5 rounded-base border-2 border-border bg-white p-5 shadow-light">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleMintNFT)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter document title (min. 5 characters)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a description (min. 10 characters)"
                    {...field}
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="file"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>File Upload</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      {...field}
                      type="file"
                      accept=".pdf"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) onChange(file);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {createRecordStatus !== "success" && (
            <Button
              type="submit"
              className="w-full"
              disabled={
                createRecordStatus === "pending" ||
                isProcessing ||
                transactionStatus === "pending"
              }
            >
              {createRecordStatus === "pending" ||
              isProcessing ||
              transactionStatus === "pending"
                ? "Minting NFT..."
                : "Mint NFT"}
            </Button>
          )}
        </form>
      </Form>
      {createRecordStatus === "error" && (
        <Alert className="flex flex-row space-x-4 bg-rose-500">
          <AlertCircle className="size-4" />
          <div className="flex flex-col space-y-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{createError.message}</AlertDescription>
          </div>
        </Alert>
      )}
      {createRecordStatus === "success" && transactionStatus === "success" && (
        <Alert className="bg-green-300">
          <CheckCircleIcon className="size-4" />
          <AlertTitle>Transaction Hash</AlertTitle>
          <AlertDescription>
            <code>{transactionResult.transactionHash}</code>
          </AlertDescription>
        </Alert>
      )}
      <Toaster />
    </div>
  );
}

export default UserUploadPage;
