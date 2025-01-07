import PageFooter from "@/components/page-footer";
import PageHeader from "@/components/page-header";
import { USER_ROLE } from "@/types/roles";
import { currentUser } from "@clerk/nextjs/server";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { redirect } from "next/navigation";
import React from "react";
import { ThirdwebProvider } from "thirdweb/react";

export default async function NotificationsLayout({
  children,
  organization,
  user,
}: {
  children: React.ReactNode;
  organization: React.ReactNode;
  user: React.ReactNode;
}) {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");
  const role = clerkUser.publicMetadata.role;
  if (!role) redirect("/role-select");
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between border-2 border-border bg-white bg-[radial-gradient(#80808080_1px,transparent_1px)] shadow-light [background-size:16px_16px]">
      <ThirdwebProvider>
        <PageHeader title="Notifications" />
        {role === USER_ROLE ? user : organization}
        <PageFooter />
        <ReactQueryDevtools />
      </ThirdwebProvider>
    </div>
  );
}
