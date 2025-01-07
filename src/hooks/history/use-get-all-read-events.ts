import { apiClient } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<
  typeof apiClient.api.history.read.all.$get,
  200
>;

export const useGetAllReadEvents = (id?: string) => {
  const query = useQuery<ResponseType, Error>({
    queryKey: ["get-all-read-events", { id }],
    enabled: false,
    queryFn: async () => {
      const response = await apiClient.api.history.read.all.$get();
      if (!response.ok) throw new Error("Failed to fetch all read events!");
      const data = await response.json();
      return data;
    },
  });
  return query;
};
