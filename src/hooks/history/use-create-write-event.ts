import { apiClient } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useToast } from "@/hooks/use-toast";

type ResponseType = InferResponseType<
  typeof apiClient.api.history.write.$post,
  201
>;
type RequestType = InferRequestType<
  typeof apiClient.api.history.write.$post
>["json"];

export const useCreateWriteEvent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (newEvent) => {
      const response = await apiClient.api.history.write.$post({
        json: newEvent,
      });
      if (!response.ok) throw new Error("Failed to create write event!");
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["get-write-events", { id: data.user_id }],
      });
    },
    onError: (err) => {
      console.error(err);
      toast({
        title: "Error (Write Operation)",
        description: "Failed to create write event for current document",
      });
    },
  });
  return mutation;
};
