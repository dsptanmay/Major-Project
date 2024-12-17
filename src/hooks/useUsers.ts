import { userRoleEnum } from "@/db/schema_2";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

type CreateUserInput = {
  wallet_address: string;
  role: (typeof userRoleEnum.enumValues)[number];
  username: string;
  user_id: string;
};

type User = {
  id: string;
  wallet_address: string;
  role: (typeof userRoleEnum.enumValues)[number];
  username: string;
  created_at: string;
};

export const useCreateUser = () => {
  return useMutation<User, Error, CreateUserInput>({
    mutationFn: (newUser) => {
      const { data } = axios
        .post("/api/test/users", newUser)
        .then((res) => res.data);
      return data;
    },
  });
};

export const useGetUser = (walletAddress?: string) => {
  return useQuery<User>({
    queryKey: ["user", walletAddress],
    queryFn: async () => {
      if (!walletAddress) throw new Error("Wallet Address is required");
      const { data } = await axios.get(
        `/api/test/users?walletAddress=${walletAddress}`,
      );
      return data;
    },
  });
};
