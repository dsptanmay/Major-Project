import { apiClient } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetUser = (id?: string) => {
  const query = useQuery({
    queryKey: ["users", { id }],
    enabled: !!id,
    queryFn: async () => {
      const response = await apiClient.api.users[":id"].$get({ param: { id } });
      if (!response.ok) throw new Error("Failed to fetch user");
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
