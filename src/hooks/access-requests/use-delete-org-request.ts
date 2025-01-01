import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { InferRequestType, InferResponseType } from "hono";
import { apiClient } from "@/lib/hono";

type ResponseType = InferResponseType<
  typeof apiClient.api.access_requests.$delete,
  201
>;

type RequestType = InferRequestType<
  typeof apiClient.api.access_requests.$delete
>;

export const useDeleteRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ query }) => {
      const response = await apiClient.api.access_requests.$delete({
        query,
      });
      if (!response.ok) throw new Error("Failed to delete request");
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Successfully deleted request (${data.id})`,
      });
      queryClient.invalidateQueries({ queryKey: ["access-requests"] });
    },
    onError: (err, variables) => {
      console.error("Error in deleting request: ", err);
      toast({
        title: "Error",
        description: `Failed to delete request with Token ID ${variables.query.token_id}`,
        variant: "destructive",
      });
    },
  });
  return mutation;
};
