import { apiClient } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetRecord = (tokenId?: string, hasAccess?: boolean) => {
  const query = useQuery({
    queryKey: ["record", { tokenId }],
    enabled: !!tokenId && !!hasAccess,
    queryFn: async () => {
      const response = await apiClient.api.medical_records[":token_id"].$get({
        param: { token_id: tokenId },
      });
      if (!response.ok)
        throw new Error(`Failed to fetch record with token ID ${tokenId}`);
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
