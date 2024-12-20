import {
  InsertNotification,
  notificationStatusEnum,
  SelectNotification,
} from "@/db/schema_2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type UserNotifications = {
  id: string;
  tokenId: string;
  message: string;
  orgName: string;
  orgAddress: string;
};

type OrgNotifications = {
  id: string;
  tokenId: string;
  message: string;
  recordTitle: string;
  status: (typeof notificationStatusEnum.enumValues)[number];
};

export const useUserNotifications = (walletAddress?: string) => {
  return useQuery<UserNotifications[], Error>({
    queryKey: ["notifications", walletAddress],
    enabled: !!walletAddress,
    queryFn: async () => {
      const { data } = await axios.get<UserNotifications[]>(
        `/api/test/notifications?walletAddress=${walletAddress}`,
      );
      return data;
    },
  });
};

export const useOrgNotifications = (walletAddress?: string) => {
  return useQuery<OrgNotifications[], Error>({
    queryKey: ["notifications", walletAddress],
    enabled: !!walletAddress,
    queryFn: async () => {
      const { data } = await axios.get<OrgNotifications[]>(
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
    onMutate: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

type UpdateNotificationData = {
  notification_id: string;
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
  });
};
