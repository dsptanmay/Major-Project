import { contract } from "@/app/client";
import { checkAccessPermission } from "@/thirdweb/11155111/functions";
import { useQuery } from "@tanstack/react-query";

export const useHasAccess = (token_id?: string, wallet_address?: string) => {
  const query = useQuery<boolean, Error>({
    queryKey: ["has-access", { token_id, wallet_address }],
    enabled: !!token_id && !!wallet_address,
    queryFn: async () => {
      const response = await checkAccessPermission({
        contract: contract,
        tokenId: BigInt(token_id!),
        user: wallet_address!,
      });
      return response;
    },
  });
  return query;
};
