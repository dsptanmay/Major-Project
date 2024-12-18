import { InsertUser, SelectUser } from "@/db/schema_2";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

type InsertUserData = { clerk_user_id: string } & InsertUser;

export const useCreateUser = () => {
  return useMutation<
    SelectUser,
    Error,
    Omit<InsertUserData, "id" | "created_at">
  >({
    mutationFn: async (newUser) => {
      const response = await axios.post("/api/test/users", newUser);
      const data: SelectUser = response.data;
      return data;
    },
  });
};

export const useGetUser = (walletAddress?: string) => {
  return useQuery<SelectUser, Error>({
    queryKey: ["user", walletAddress],
    queryFn: async () => {
      if (!walletAddress) throw new Error("Wallet Address is required");
      const response = await axios.get(
        `/api/test/users?walletAddress=${walletAddress}`,
      );
      const data: SelectUser = response.data;
      return data;
    },
  });
};
