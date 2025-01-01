import { apiClient } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type UserResponseType = InferResponseType<
  typeof apiClient.api.access_requests.user.$get,
  200
>["data"];

type OrgResponseType = InferResponseType<
  typeof apiClient.api.access_requests.org.$get,
  200
>["data"];

export const useGetUserRequests = (id?: string) => {
  const query = useQuery<UserResponseType, Error>({
    queryKey: ["access-requests", { id }],
    enabled: !!id,
    queryFn: async () => {
      const response = await apiClient.api.access_requests.user.$get();
      if (!response.ok) throw new Error("Failed to fetch requests");
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};

export const useGetOrgRequests = (id?: string) => {
  const query = useQuery<OrgResponseType, Error>({
    queryKey: ["access-requests", { id }],
    enabled: !!id,
    queryFn: async () => {
      const response = await apiClient.api.access_requests.org.$get();
      if (!response.ok) throw new Error("Failed to fetch requests");
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
