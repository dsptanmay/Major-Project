import { apiClient } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useToast } from "@/hooks/use-toast";

type ResponseType = InferResponseType<
  typeof apiClient.api.access_requests.$patch,
  201
>;

type RequestType = InferRequestType<
  typeof apiClient.api.access_requests.$patch
>["json"];

export const useEditRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (patchData) => {
      const response = await apiClient.api.access_requests.$patch({
        json: patchData,
      });
      if (!response.ok) throw new Error("Failed to edit access request");
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Successfully marked request ${data.id} as ${data.status}`,
      });
      queryClient.invalidateQueries({ queryKey: ["access-requests"] });
    },
    onError: (err, variables) => {
      console.error(err);
      toast({
        title: "Error",
        description: `Failed to mark request as ${variables.status}`,
        variant: "destructive",
      });
    },
  });
  return mutation;
};
