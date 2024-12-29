import { contract } from "@/app/client";
import { getIPFSHash } from "@/thirdweb/11155111/functions";
import { useQuery } from "@tanstack/react-query";

export function useGetIpfs(walletAddress?: string, tokenId?: string) {
  return useQuery({
    queryKey: ["ipfs", { walletAddress, tokenId }],
    enabled: !!walletAddress && !!tokenId,
    queryFn: async () => {
      const data = await getIPFSHash({
        contract: contract,
        caller: walletAddress!,
        tokenId: BigInt(tokenId!),
      });
      return data;
    },
  });
}
