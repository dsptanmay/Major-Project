import { apiClient } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<
  typeof apiClient.api.history.read.$get,
  200
>;

export const useGetReadEvents = (id?: string) => {
  const query = useQuery<ResponseType, Error>({
    queryKey: ["get-read-events", { id }],
    enabled: !!id,
    queryFn: async () => {
      const response = await apiClient.api.history.read.$get();
      if (!response.ok) throw new Error("Failed to fetch read events for user");
      const data = await response.json();
      return data;
    },
  });

  return query;
};
