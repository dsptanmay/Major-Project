import { apiClient } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useToast } from "@/hooks/use-toast";

type ResponseType = InferResponseType<
  (typeof apiClient.api.access_requests)[":id"]["$delete"],
  201
>;

type RequestType = InferRequestType<
  (typeof apiClient.api.access_requests)[":id"]["$delete"]
>;

export const useDeleteRequestById = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await apiClient.api.access_requests[":id"]["$delete"]({
        param,
      });
      if (!response.ok) throw new Error("Failed to edit access request");
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Successfully deleted access request (${data.id})`,
      });
      queryClient.invalidateQueries({ queryKey: ["access-requests"] });
    },
    onError: (err, variables) => {
      console.error(err);
      toast({
        title: "Error",
        description: `Failed to delete request with ID ${variables.param.id}`,
        variant: "destructive",
      });
    },
  });
  return mutation;
};
