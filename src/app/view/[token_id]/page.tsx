"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import LoadingStateComponent from "@/components/loading-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { client } from "@/app/client";
import { resolveScheme } from "thirdweb/storage";
import { useActiveAccount } from "thirdweb/react";

import { useGetIpfs } from "@/hooks/useIpfs";
import { useCheckAccess } from "@/hooks/useRequests";

function TestUserView({ params }: { params: { token_id: string } }) {
  const [pdfUrl, setPdfUrl] = useState<string | undefined>(undefined);
  const [documentName, setDocumentName] = useState<string>();
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);

  const router = useRouter();
  const activeAccount = useActiveAccount();

  const ipfsQuery = useGetIpfs(activeAccount?.address, params.token_id);
  const { data: hasAccess, status: accessStatus } = useCheckAccess(
    activeAccount?.address,
    params.token_id,
  );

  const pdfViewerRef = useRef<HTMLIFrameElement>(null);

  async function decryptPDF(
    url: string,
    key: string,
  ): Promise<{
    pdf_url: undefined | string;
    original_name: undefined | string;
  }> {
    try {
      const forge = await import("node-forge");
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP Error! Status: ${response.status}`);
      const encryptedData: {
        iv: string;
        encryptedContent: string;
        originalName: string;
      } = await response.json();
      if (
        !encryptedData.iv ||
        !encryptedData.encryptedContent ||
        !encryptedData.originalName
      )
        throw new Error("Invalid file formatting");

      if (key.length === 0) throw new Error("Decryption key is empty!");

      try {
        const keyBytes = forge.util.hexToBytes(key);
        const ivBytes = forge.util.hexToBytes(encryptedData.iv);
        const encryptedBytes = forge.util.hexToBytes(
          encryptedData.encryptedContent,
        );

        const decipher = forge.cipher.createDecipher("AES-CBC", keyBytes);
        decipher.start({ iv: ivBytes });

        decipher.update(forge.util.createBuffer(encryptedBytes));
        const ok = decipher.finish();
        if (!ok) throw new Error("Decryption failed!");

        const decryptedBytes = decipher.output.getBytes();
        if (decryptedBytes.length === 0) throw new Error("Content is empty!");

        const base64PDF = btoa(decryptedBytes);
        const pdfDataURL = `data:application/pdf;base64,${base64PDF}`;
        return {
          pdf_url: pdfDataURL,
          original_name: encryptedData.originalName,
        };
      } catch (error) {
        console.error(error);
        throw new Error(`Conversion Error: ${error} `);
      }
    } catch (err) {
      console.error(err);
      return { pdf_url: undefined, original_name: undefined };
    }
  }

  const handleDecrypt = async () => {
    setIsDecrypting(true);
    const { data } = await ipfsQuery.refetch();
    if (!data) return;
    const ipfsUrl = resolveScheme({ uri: data, client: client });
    decryptPDF(ipfsUrl, "x")
      .then((result) => {
        setDocumentName(result.original_name);
        setPdfUrl(result.pdf_url);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsDecrypting(false);
      });
  };

  if (accessStatus === "pending")
    return <LoadingStateComponent content="Checking Access..." />;
  if (accessStatus === "error")
    return (
      <Alert className="bg-rose-500">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to check access</AlertDescription>
      </Alert>
    );

  if (!hasAccess) router.push("/dashboard");

  return (
    <div className="flex w-full max-w-6xl flex-col space-y-5 border-2 border-border bg-white p-5 shadow-light">
      <h1>Document for Token ID {params.token_id}</h1>
      {!pdfUrl && (
        <Button
          className="w-full"
          onClick={() => handleDecrypt()}
          disabled={isDecrypting}
        >
          {isDecrypting ? "Decrypting..." : "Decrypt Document"}
        </Button>
      )}
      {pdfUrl && (
        <iframe
          ref={pdfViewerRef}
          src={pdfUrl}
          width="100%"
          height="600px"
          title={documentName}
          className="border-none"
        />
      )}
    </div>
  );
}

export default TestUserView;
