import { contract } from "@/app/client";
import { SelectRecord } from "@/db/schema_2";
import { nextTokenIdToMint } from "@/thirdweb/11155111/functions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetRecords = (walletAddress?: string) => {
  return useQuery<SelectRecord[], Error>({
    queryKey: ["records", walletAddress],
    queryFn: async () => {
      if (!walletAddress) throw new Error("Wallet Address is required");
      const response = await axios.get(
        `/api/test/medical-records?walletAddress=${walletAddress}`,
      );
      const data: SelectRecord[] = response.data;
      return data;
    },
    enabled: !!walletAddress,
    refetchOnWindowFocus: true,
  });
};

type InsertRecordData = {
  wallet_address: string;
  token_id: string;
  encryption_key: string;
  title: string;
  description: string;
};

export const useCreateRecord = () => {
  const queryClient = useQueryClient();
  return useMutation<SelectRecord, Error, InsertRecordData>({
    mutationFn: async (newRecord) => {
      const response = await axios.post("/api/test/medical-records", newRecord);
      const data: SelectRecord = response.data;
      return data;
    },
    onSettled: (data, err, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["records", variables.wallet_address],
        exact: true,
      });
    },
  });
};

export const useGetTokenID = () => {
  return useQuery({
    queryKey: ["token-id"],
    enabled: false,
    queryFn: async () => {
      const data = await nextTokenIdToMint({ contract });
      return data;
    },
  });
};
