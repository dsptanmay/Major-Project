import { apiClient } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useToast } from "@/hooks/use-toast";

type ResponseType = InferResponseType<typeof apiClient.api.users.$post, 201>;
type RequestType = InferRequestType<typeof apiClient.api.users.$post>["json"];

export const useCreateUser = () => {
  const { toast } = useToast();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await apiClient.api.users.$post({ json: data });
      if (!response.ok) throw new Error("Server Error");
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Created user successfully (${data.id})`,
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    },
  });
  return mutation;
};
