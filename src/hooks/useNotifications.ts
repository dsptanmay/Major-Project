import {
  InsertNotification,
  notificationStatusEnum,
  SelectNotification,
} from "@/db/schema_2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export type UserNotification = {
  id: string;
  tokenId: string;
  message: string;
  orgName: string;
  orgAddress: string;
};

export type OrgNotification = {
  id: string;
  tokenId: string;
  message: string;
  recordTitle: string;
  status: (typeof notificationStatusEnum.enumValues)[number];
};

export const useUserNotifications = (walletAddress?: string) => {
  return useQuery<UserNotification[], Error>({
    queryKey: ["notifications", walletAddress],
    enabled: !!walletAddress,
    queryFn: async () => {
      const { data } = await axios.get<UserNotification[]>(
        `/api/test/notifications?walletAddress=${walletAddress}`,
      );
      return data;
    },
  });
};

export const useOrgNotifications = (walletAddress?: string) => {
  return useQuery<OrgNotification[], Error>({
    queryKey: ["notifications", walletAddress],
    enabled: !!walletAddress,
    queryFn: async () => {
      const { data } = await axios.get<OrgNotification[]>(
        `/api/test/notifications?walletAddress=${walletAddress}`,
      );
      return data;
    },
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation<SelectNotification, Error, InsertNotification>({
    mutationFn: async (newUser) => {
      const response = await axios.post("/api/test/notifications", newUser);
      const data: SelectNotification = response.data;
      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

type UpdateNotificationData = {
  notification_id: string;
  org_address: string;
  status: "approved" | "denied";
};

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation<SelectNotification, Error, UpdateNotificationData>({
    mutationFn: async (updateData) => {
      const response = await axios.patch("/api/test/notifications", updateData);
      const data: SelectNotification = response.data;
      return data;
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", variables.org_address],
        exact: true,
      });
    },
  });
};

type DeleteNotificationData = {
  notification_id: string;
  org_address: string;
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation<SelectNotification, Error, DeleteNotificationData>({
    mutationFn: async (deleteData) => {
      const response = await axios.delete<SelectNotification>(
        "/api/test/notifications",
        {
          headers: { "x-notification-id": deleteData.notification_id },
        },
      );
      const data = response.data;
      return data;
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", variables.org_address],
        exact: true,
      });
    },
  });
};
