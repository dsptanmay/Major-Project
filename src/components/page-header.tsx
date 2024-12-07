"use client";
import React from "react";
import { ConnectButton } from "thirdweb/react";
import { client, wallets } from "@/app/client";
import { SignOutButton, useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import ConnectWalletButton from "./connect-wallet-btn";

function PageHeader({
  title,
}: {
  title: string;
  buttonText?: string;
  buttonUrl?: string;
}) {
  const { user } = useUser();

  return (
    <div className="flex w-full items-center justify-between rounded-none border-b-[3px] border-border bg-white px-8 py-5 ">
      <div className="flex items-center space-x-3">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <div className="flex items-center justify-between space-x-3">
        <ConnectButton client={client} wallets={wallets} />
        {/* <ConnectWalletButton /> */}
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
        {/* <ThemeSwitcher /> */}
      </div>
    </div>
  );
}

export default PageHeader;
