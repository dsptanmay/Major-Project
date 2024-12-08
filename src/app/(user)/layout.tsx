import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ThirdwebProvider } from "thirdweb/react";
import React from "react";
import { USER_ROLE } from "@/types/roles";

async function UserLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const role = user.publicMetadata.role;
  if (!role) redirect("/role-select");
  if (role !== USER_ROLE) redirect("/");
  return <ThirdwebProvider>{children}</ThirdwebProvider>;
}

export default UserLayout;
