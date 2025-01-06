import PageFooter from "@/components/page-footer";
import PageHeader from "@/components/page-header";
import { USER_ROLE } from "@/types/roles";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
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
    <div className="flex min-h-screen w-full flex-col items-center justify-between bg-white bg-[radial-gradient(#80808080_1px,transparent_1px)] shadow-light [background-size:16px_16px]">
      <PageHeader title="Dashboard" />
      {role === USER_ROLE ? user : organization}
      <PageFooter />
    </div>
  );
}
