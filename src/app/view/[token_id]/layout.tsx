import React from "react";
import PageFooter from "@/components/page-footer";
import PageHeader from "@/components/page-header";
import { ThirdwebProvider } from "thirdweb/react";

interface ViewProps {
  children: React.ReactNode;
  params: { token_id: string };
}

function UserViewLayout({ children }: ViewProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between bg-white bg-[radial-gradient(#80808080_1px,transparent_1px)] shadow-light [background-size:16px_16px]">
      <ThirdwebProvider>
        <PageHeader title="View Document" />
        {children}
        <PageFooter />
      </ThirdwebProvider>
    </div>
  );
}

export default UserViewLayout;
