"use client";
import React from "react";
import { ConnectButton } from "thirdweb/react";
import { client, wallets } from "@/app/client";
import { SignOutButton, useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

function PageHeader({ title }: { title: string }) {
  const { user } = useUser();
  const pathName = usePathname();
  return (
    <div className="mb-5 flex w-full items-center justify-between rounded-none border-b-[3px] border-border bg-bg px-8 py-5">
      <div className="flex items-center space-x-3">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <div className="flex items-center justify-between space-x-3">
        {pathName.endsWith("/dashboard") ? (
          <></>
        ) : (
          <ConnectButton
            client={client}
            wallets={wallets}
            connectModal={{ size: "compact", showThirdwebBranding: false }}
          />
        )}
        {!user && (
          <SignInButton forceRedirectUrl={"/dashboard"}>
            <Button>Sign In</Button>
          </SignInButton>
        )}
        {user && (
          <SignOutButton redirectUrl="/">
            <Button>Sign Out</Button>
          </SignOutButton>
        )}
        {user && !pathName.endsWith("/profile") && (
          <Link href="/profile">
            <Button>Profile</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
