import { apiClient } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useToast } from "@/hooks/use-toast";

type ResponseType = InferResponseType<
  typeof apiClient.api.notifications.$post,
  201
>;

type RequestType = InferRequestType<
  typeof apiClient.api.notifications.$post
>["json"];

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (newNotification) => {
      const response = await apiClient.api.notifications.$post({
        json: newNotification,
      });
      if (!response.ok) throw new Error("Failed to create notification");
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", { id: data.user_id }],
      });
      toast({
        title: "Success",
        description: `Created notification successfully (${data.id})`,
      });
    },
    onError: (err, variables) => {
      toast({
        title: "Error",
        description: `${variables.token_id} : ${err.message}`,
      });
    },
  });
  return mutation;
};
