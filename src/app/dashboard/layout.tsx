import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import UserDashboardPage from "@/components/user-dashboard";
import OrganizationDashboardPage from "@/components/org-dashboard";
import { ORG_ROLE, USER_ROLE } from "@/types/roles";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const role = user.publicMetadata.role;
  if (!role) redirect("/role-select");

  if (role === USER_ROLE) return <UserDashboardPage />;
  if (role === ORG_ROLE) return <OrganizationDashboardPage />;
}
