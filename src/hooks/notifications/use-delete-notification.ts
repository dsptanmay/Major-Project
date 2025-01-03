import { useToast } from "@/hooks/use-toast";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";

type RequestType = InferRequestType<
  (typeof apiClient.api.notifications)[":id"]["$delete"]
>;

type ResponseType = InferResponseType<
  (typeof apiClient.api.notifications)[":id"]["$delete"],
  201
>;

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await apiClient.api.notifications[":id"]["$delete"]({
        param,
      });
      if (!response.ok) throw new Error("Failed to delete notification");
      const data = await response.json();
      return data;
    },

    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Deleted notification successfully (${data.id})`,
      });
      queryClient.invalidateQueries({
        queryKey: ["notifications", { id: data.id }],
      });
    },
    onError: (err, variables) => {
      console.error(err);
      toast({
        title: "Error",
        description: `Failed to delete notification with ID ${variables.param.id}`,
        variant: "destructive",
      });
    },
  });
  return mutation;
};
