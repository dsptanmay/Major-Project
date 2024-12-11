"use client";
import { client, contract } from "@/app/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleCheck, FileKey2, Link2, Wallet } from "lucide-react";
import React, { useState } from "react";
import {
  useActiveAccount,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";
import { upload } from "thirdweb/storage";
import { prepareContractCall } from "thirdweb";

function AddRecordsPage() {
  const { mutate: sendTransaction } = useSendTransaction();
  const { data: tokenID } = useReadContract({
    contract,
    method: "function nextTokenIdToMint() view returns (uint256)",
    params: [],
  });

  const formSchema = z.object({
    title: z.string().min(10, {
      message: "Title must be at least 10 characters.",
    }),
    description: z.string().min(10, {
      message: "Description must be at least 10 characters",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  const activeAccount = useActiveAccount();
  const [file, setFile] = useState<File | null>(null);
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
  const [ipfsLink, setIpfsLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };
  const handleEncryptAndUpload = async () => {
    if (!file) {
      setError("Please select a PDF file first");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setIpfsLink(null);

    try {
      const forge = await import("node-forge");

      const fileBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(fileBuffer);
      const key = forge.random.getBytesSync(32); // 256-bit key
      const iv = forge.random.getBytesSync(16); // 128-bit IV for AES-CBC
      const cipher = forge.cipher.createCipher("AES-CBC", key);

      cipher.start({
        iv: iv,
      });

      cipher.update(forge.util.createBuffer(uint8Array));
      cipher.finish();

      const encrypted = cipher.output;

      const encryptedData = {
        iv: forge.util.bytesToHex(iv),
        encryptedContent: encrypted.toHex(),
        originalName: file.name,
      };

      const encryptedBlob = new Blob([JSON.stringify(encryptedData)], {
        type: "application/json",
      });

      const encryptedFile = new File(
        [encryptedBlob],
        `${file.name}.encrypted.json`,
        {
          type: "application/json",
        },
      );

      // Upload to IPFS
      const uri = await upload({ client, files: [encryptedFile] });

      setIpfsLink(uri);
      const hexKey = forge.util.bytesToHex(key);
      setEncryptionKey(hexKey);
    } catch (err) {
      setError(
        "Encryption/Upload failed: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const mintNFT = async (title: string, description: string) => {
    const data = {
      token_id: tokenID!.toString(),
      user_address: activeAccount!.address,
      title,
      description,
    };
    try {
      setIsMinting(true);
      const userResponse = await fetch("/api/user-files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const tokenResponse = await fetch("/api/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token_id: tokenID!.toString(),
          encryption_key: encryptionKey!.toString(),
        }),
      });

      const transaction = prepareContractCall({
        contract,
        method:
          "function mintNFT(address to, string ipfsHash) returns (uint256)",
        params: [activeAccount!.address, ipfsLink!],
      });

      sendTransaction(transaction);
      if (userResponse.ok && tokenResponse.ok) {
        setIsMinting(false);
        setSuccess("Minted NFT Successfully!");
        setIsMinted(true);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to mint NFT!");
      setSuccess(null);
      setIsMinting(false);
    }
  };
  function onSubmit(values: z.infer<typeof formSchema>) {
    mintNFT(values.title, values.description);
  }
  if (!activeAccount)
    return (
      <div className="">
        <Alert className="bg-red-300">
          <Wallet className="h-4 w-4" />
          <AlertTitle>Missing Crypto Wallet</AlertTitle>
          <AlertDescription>Please connect your wallet first!</AlertDescription>
        </Alert>
      </div>
    );
  return (
    <div className="flex w-full max-w-6xl flex-col space-y-5 rounded-none border-2 border-border bg-white px-10 py-10 shadow-light ">
      <div className="flex w-full flex-col space-y-2">
        <Label
          htmlFor="file-upload-input"
          className="font-semibold text-gray-800"
        >
          Your file will be encrypted with AES-256 and uploaded to IPFS
        </Label>
        <Input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          id="file-upload-input"
        />
      </div>
      {file && !ipfsLink && (
        <Button onClick={handleEncryptAndUpload}>
          {isProcessing ? "Uploading document.." : "Upload Document"}
        </Button>
      )}
      {encryptionKey && (
        <Alert className="bg-yellow-300">
          <FileKey2 className="h-4 w-4" />
          <AlertTitle>Encryption Key</AlertTitle>
          <AlertDescription>{encryptionKey}</AlertDescription>
        </Alert>
      )}
      {ipfsLink && (
        <Alert className="bg-sky-300">
          <Link2 className="h-4 w-4" />
          <AlertTitle>IPFS Link</AlertTitle>
          <AlertDescription>{ipfsLink}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 font-bold"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a title" {...field} />
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
                  <Input placeholder="Enter a description" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          {ipfsLink && !isMinted && (
            <Button type="submit" className="w-full">
              {isMinting ? "Minting NFT..." : "Mint NFT"}
            </Button>
          )}
        </form>
      </Form>
      {success && (
        <Alert className="bg-green-300">
          <CircleCheck className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default AddRecordsPage;
