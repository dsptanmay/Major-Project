import { apiClient } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetRecords = (id?: string) => {
  const query = useQuery({
    queryKey: ["records", { id }],
    enabled: !!id,
    queryFn: async () => {
      const response = await apiClient.api.medical_records.$get();
      if (!response.ok) throw new Error("Failed to fetch records");
      const { records } = await response.json();
      return records;
    },
    refetchOnWindowFocus: "always",
  });
  return query;
};
