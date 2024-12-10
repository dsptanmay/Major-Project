"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Wallet } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";

function UserViewPage({ params }: { params: { token_id: string } }) {
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [ipfsURL, setIpfsURL] = useState<string | null>(null);
  const [decryptionKey, setDecryptionKey] = useState<string | null>(null);
  const activeAccount = useActiveAccount();
  const tokenId = params.token_id;

  useEffect(() => {
    const fetchHash = async () => {
      const ipfsResponse = await fetch(
        `/api/ipfs?userAddress=${activeAccount!.address}&tokenId=${tokenId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      const tokenResponse = await fetch(`/api/tokens?tokenId=${tokenId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (ipfsResponse.ok) {
        const ipfsHash: string = await ipfsResponse.json();
        setIpfsURL(
          `https://${process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}.ipfscdn.io/ipfs/${ipfsHash.substring(7)}`,
        );
      } else {
        setIpfsURL(null);
        return;
      }

      if (tokenResponse.ok) {
        const data = await tokenResponse.json();
        setDecryptionKey(data);
      } else {
        setDecryptionKey(null);
      }
      setIsFetched(true);
    };
    if (activeAccount) fetchHash();
  }, [activeAccount, tokenId, isFetched, ipfsURL, decryptionKey]);

  const decryptPDF = async (
    url: string,
    decryptionKey: string,
  ): Promise<{ pdfUrl: string; originalName: string }> => {
    try {
      const forge = await import("node-forge");
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const encryptedData = await response.json();

      if (
        !encryptedData.iv ||
        !encryptedData.encryptedContent ||
        !encryptedData.originalName
      ) {
        throw new Error("Invalid file formatting!");
      }

      if (decryptionKey.length === 0)
        throw new Error("Decryption Key is empty!");

      try {
        const keyBytes = forge.util.hexToBytes(decryptionKey);
        const ivBytes = forge.util.hexToBytes(encryptedData.iv);
        const encryptedBytes = forge.util.hexToBytes(
          encryptedData.encryptedContent,
        );

        const decipher = forge.cipher.createDecipher("AES-CBC", keyBytes);
        decipher.start({
          iv: ivBytes,
        });

        decipher.update(forge.util.createBuffer(encryptedBytes));
        const pass = decipher.finish();
        if (!pass) {
          throw new Error("Decryption failed");
        }

        const decryptedBytes = decipher.output.getBytes();
        if (decryptedBytes.length === 0)
          throw new Error("Decrypted content is empty");

        const base64PDF = btoa(decryptedBytes);

        const pdfDataURL = `data:application/pdf;base64,${base64PDF}`;
        return { pdfUrl: pdfDataURL, originalName: encryptedData.originalName };
      } catch (conversionErr) {
        console.error("Conversion Error:", conversionErr);
        throw new Error(
          `Conversion failed: ${
            conversionErr instanceof Error
              ? conversionErr.message
              : "Unknown conversion error"
          }`,
        );
      }
    } catch (err) {
      console.error("Decryption Error:", err);
      throw new Error(
        "Decryption failed: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
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

  if (!ipfsURL || !decryptionKey)
    return (
      <div>
        <Alert className="bg-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unauthorized Viewer</AlertTitle>
          <AlertDescription>
            You are not authorized to view this document!
          </AlertDescription>
        </Alert>
      </div>
    );
  return (
    <div className="flex w-full max-w-6xl flex-col space-y-5 border-[3px] border-border bg-white p-5 shadow-light">
      <h1>Document for Token ID {tokenId}</h1>
      {isFetched && <Button className="w-full">Decrypt Document</Button>}
    </div>
  );
}

export default UserViewPage;
