import { apiClient } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useToast } from "@/hooks/use-toast";

type ResponseType = InferResponseType<
  typeof apiClient.api.access_requests.$post,
  201
>;

type RequestType = InferRequestType<
  typeof apiClient.api.access_requests.$post
>["json"];

export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (newRequest) => {
      const response = await apiClient.api.access_requests.$post({
        json: newRequest,
      });
      if (!response.ok) throw new Error("Failed to create request");
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Successfully created access request (${data.id})`,
      });
      queryClient.invalidateQueries({ queryKey: ["access-requests"] });
    },
    onError: (err, variables) => {
      console.error(err);
      toast({
        title: "Error",
        description: `Failed to create access request for Token ID ${variables.token_id}`,
      });
    },
  });
  return mutation;
};
