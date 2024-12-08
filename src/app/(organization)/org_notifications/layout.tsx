import * as React from "react";
import type { ReactNode } from "react";

import PageHeader from "@/components/page-header";
import PageFooter from "@/components/page-footer";

type LayoutProps = {
  children: ReactNode;
};

export default function OrgNotificationsLayout(
  props: LayoutProps,
): React.ReactNode {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between bg-white bg-[radial-gradient(#80808080_1px,transparent_1px)] shadow-light [background-size:16px_16px]">
      <PageHeader title="Notifications" />
      {props.children}
      <PageFooter />
    </div>
  );
}
