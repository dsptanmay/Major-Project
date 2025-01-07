import { apiClient } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<
  typeof apiClient.api.history.write.$get,
  200
>;

export const useGetWriteEvents = (id?: string) => {
  const query = useQuery<ResponseType, Error>({
    queryKey: ["get-write-events", { id }],
    enabled: !!id,
    queryFn: async () => {
      const response = await apiClient.api.history.write.$get();
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      return data;
    },
  });

  return query;
};
