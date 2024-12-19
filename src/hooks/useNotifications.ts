import {
  InsertNotification,
  notificationStatusEnum,
  SelectNotification,
} from "@/db/schema_2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetNotifications = (walletAddress?: string) => {
  return useQuery<SelectNotification[], Error>({
    queryKey: ["notifications", walletAddress],
    queryFn: () => {
      if (!walletAddress) throw new Error("Wallet Address is required");
      return axios
        .get(`/api/test/notifications?walletAddress=${walletAddress}`)
        .then((response) => response.data);
    },
    enabled: !!walletAddress,
    refetchOnWindowFocus: true,
    // refetchInterval: 5000,
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
