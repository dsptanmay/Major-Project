import { ORG_ROLE } from "@/types/roles";
import { currentUser } from "@clerk/nextjs/server";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { redirect } from "next/navigation";
import React from "react";
import { ThirdwebProvider } from "thirdweb/react";

async function OrganizationLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const role = user.publicMetadata.role;
  if (!role) redirect("/role-select");
  if (role !== ORG_ROLE) redirect("/");
  return (
    <ThirdwebProvider>
      {children}
      <ReactQueryDevtools
        position="bottom"
        buttonPosition="bottom-right"
        initialIsOpen={false}
      />
    </ThirdwebProvider>
  );
}

export default OrganizationLayout;
