import { contract } from "@/app/client";
import { SelectRequest } from "@/db/schema_2";
import { checkAccessPermission } from "@/thirdweb/11155111/functions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetRequestsOrg = (walletAddress?: string) => {
  return useQuery<
    {
      requestId: string;
      recordTitle: string;
      recordDescription: string;
      recordTokenId: string;
      requestedAt: string;
      processedAt: string;
    }[],
    Error
  >({
    queryKey: ["access-requests", walletAddress],
    enabled: !!walletAddress,
    queryFn: async () => {
      const response = await axios.get<
        {
          requestId: string;
          recordTitle: string;
          recordDescription: string;
          recordTokenId: string;
          requestedAt: string;
          processedAt: string;
        }[]
      >(`/api/test/access-request?walletAddress=${walletAddress}`);
      const data = response.data;
      return data;
    },
  });
};

export const useGetRequestsUser = (walletAddress?: string) => {
  return useQuery<
    {
      requestId: string;
      recordTitle: string;
      recordTokenId: string;
      processedAt: string | null;
      organizationName: string;
      organizationWallet: string;
    }[],
    Error
  >({
    queryKey: ["access-requests", walletAddress],
    enabled: !!walletAddress,
    queryFn: async () => {
      const response = await axios.get(
        `/api/test/access-request?walletAddress=${walletAddress}`,
      );
      const data = response.data;
      return data;
    },
  });
};

type InsertRequestData = {
  token_id: string;
  org_wallet_address: string;
};

export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<SelectRequest, Error, InsertRequestData>({
    mutationFn: async (newRequest) => {
      const response = await axios.post("/api/test/access-request", newRequest);
      const data: SelectRequest = response.data;
      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["access-requests"] });
    },
  });
};

type UpdateRequestData = {
  token_id: string;
  org_wallet_address: string;
  status: "approved" | "denied";
};

export const useUpdateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<SelectRequest, Error, UpdateRequestData>({
    mutationFn: async (updateData) => {
      const response = await axios.patch(
        "/api/test/access-request",
        updateData,
      );
      const data: SelectRequest = response.data;
      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["access-requests"],
      });
    },
  });
};

type DeleteRequestData = {
  request_id: string;
};

export const useDeleteRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<SelectRequest, Error, DeleteRequestData>({
    mutationFn: async (deleteData) => {
      const response = await axios.delete<SelectRequest>(
        `/api/test/access-request?id=${deleteData.request_id}`,
      );
      const data = response.data;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access-requests"] });
    },
  });
};

export const useCheckAccess = (walletAddress?: string, tokenId?: string) => {
  return useQuery<boolean, Error>({
    queryKey: ["check-access", { walletAddress, tokenId }],
    enabled: !!walletAddress && !!tokenId,
    queryFn: async () => {
      const result = await checkAccessPermission({
        contract: contract,
        tokenId: BigInt(tokenId!),
        user: walletAddress!,
      });
      return result;
    },
  });
};
