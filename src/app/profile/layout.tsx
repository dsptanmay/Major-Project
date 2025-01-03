import PageFooter from "@/components/page-footer";
import PageHeader from "@/components/page-header";
import { ORG_ROLE, USER_ROLE } from "@/types/roles";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ThirdwebProvider } from "thirdweb/react";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const role = user.publicMetadata.role;
  if (role !== USER_ROLE && role !== ORG_ROLE) redirect("/role-select-2");
  return (
    <ThirdwebProvider>
      <div className="flex min-h-screen w-full flex-col items-center justify-between border-2 border-border bg-white bg-[radial-gradient(#80808080_1px,transparent_1px)] shadow-light [background-size:16px_16px]">
        <PageHeader title="Profile" />
        {children}
        <PageFooter />
      </div>
    </ThirdwebProvider>
  );
}
