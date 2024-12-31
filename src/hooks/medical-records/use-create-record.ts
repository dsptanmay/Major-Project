import { apiClient } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";

import { useToast } from "@/hooks/use-toast";

import { useMutation } from "@tanstack/react-query";

type ResponseType = InferResponseType<
  typeof apiClient.api.medical_records.$post,
  201
>;
type RequestType = InferRequestType<
  typeof apiClient.api.medical_records.$post
>["json"];

export const useCreateRecord = () => {
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (newRecord) => {
      const response = await apiClient.api.medical_records.$post({
        json: newRecord,
      });
      if (!response.ok) throw new Error("Failed to create record");
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Created record with Token ID ${data.token_id} successfully (${data.id})`,
      });
    },
    onError: (err, variables) => {
      toast({
        title: "Error",
        description: `Failed to create record for Token ID ${variables.token_id}`,
        variant: "destructive",
      });
    },
  });
  return mutation;
};
