import { ThirdwebProvider } from "thirdweb/react";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThirdwebProvider>{children}</ThirdwebProvider>;
}
