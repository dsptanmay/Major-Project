import { apiClient } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type UserNotifications = InferResponseType<
  typeof apiClient.api.notifications.user.$get,
  200
>["data"];

export type OrgNotifications = InferResponseType<
  typeof apiClient.api.notifications.org.$get,
  201
>["data"];

export const useGetUserNotifications = (
  id?: string,
  wallet_address?: string,
) => {
  const query = useQuery<UserNotifications, Error>({
    queryKey: ["notifications", { id }],
    enabled: !!id && !!wallet_address,
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
  const query = useQuery<OrgNotifications, Error>({
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
