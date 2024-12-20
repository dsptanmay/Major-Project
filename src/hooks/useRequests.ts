import { SelectRequest } from "@/db/schema_2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetRequestsUser = (walletAddress?: string) => {
  return useQuery<SelectRequest, Error>({
    queryKey: ["access-requests", walletAddress],
    enabled: !!walletAddress,
    queryFn: async () => {
      if (!walletAddress) throw new Error("Wallet Address is required");
      const response = await axios.get(
        `/api/test/access-requests?userAddress=${walletAddress}`,
      );
      const data: SelectRequest = response.data;
      return data;
    },
  });
};

export const useGetRequestsOrganization = (walletAddress?: string) => {
  return useQuery<SelectRequest, Error>({
    queryKey: ["access-requests", walletAddress],
    enabled: !!walletAddress,
    queryFn: async () => {
      if (!walletAddress) throw new Error("Wallet Address is required");
      const response = await axios.get(
        `/api/test/access-requests?orgAddress=${walletAddress}`,
      );
      const data: SelectRequest = response.data;
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
      queryClient.refetchQueries({ queryKey: ["access-requests"] });
    },
  });
};

type UpdateRequestData = {
  request_id: string;
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
    onSettled: (data, err, variables) => {
      queryClient.refetchQueries({
        queryKey: ["access-requests"],
      });
    },
  });
};
