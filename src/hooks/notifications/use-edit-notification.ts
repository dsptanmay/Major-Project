import { apiClient } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useToast } from "../use-toast";

type RequestType = InferRequestType<
  typeof apiClient.api.notifications.$patch
>["json"];

type ResponseType = InferResponseType<
  typeof apiClient.api.notifications.$patch,
  201
>;

export const useEditNotification = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (updateData) => {
      const response = await apiClient.api.notifications.$patch({
        json: updateData,
      });
      if (!response.ok) throw new Error("Failed to update notification");
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Successfully updated notification as ${data.status} (${data.id})`,
      });
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
    onError: (err, variables) => {
      console.error(err);
      toast({
        title: "Error",
        description: `Failed to update notification as ${variables.status}`,
        variant: "destructive",
      });
    },
  });
  return mutation;
};
