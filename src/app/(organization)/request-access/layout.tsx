"use client";
import PageFooter from "@/components/page-footer";
import PageHeader from "@/components/page-header";
import React from "react";

function RequestAccessLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-screen w-full flex-col items-center justify-between bg-white bg-[radial-gradient(#80808080_1px,transparent_1px)] shadow-light [background-size:16px_16px]"
      suppressHydrationWarning={true}
    >
      <PageHeader title="Request Access" />
      {children}
      <PageFooter />
    </div>
  );
}

export default RequestAccessLayout;
