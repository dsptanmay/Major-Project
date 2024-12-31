import { apiClient } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetUserNotifications = (id?: string) => {
  const query = useQuery({
    queryKey: ["notifications", { id }],
    enabled: !!id,
    queryFn: async () => {
      const response = await apiClient.api.notifications.user.$get();
      if (!response.ok) throw new Error("Failed to fetch user notifications");
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};

export const useGetOrgNotifications = (id?: string) => {
  const query = useQuery({
    queryKey: ["notifications", { id }],
    enabled: !!id,
    queryFn: async () => {
      const response = await apiClient.api.notifications.org.$get();
      if (!response.ok) throw new Error("Failed to fetch org notifications");
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
