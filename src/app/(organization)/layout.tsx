import { ORG_ROLE } from "@/types/roles";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { ThirdwebProvider } from "thirdweb/react";

async function OrganizationLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const role = user.publicMetadata.role;
  if (!role) redirect("/role-select");
  if (role !== ORG_ROLE) redirect("/");
  return <ThirdwebProvider>{children}</ThirdwebProvider>;
}

export default OrganizationLayout;
