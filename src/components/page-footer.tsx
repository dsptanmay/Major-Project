"use client";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

function PageFooter() {
  const pathName = usePathname();
  return (
    <div className="flex w-full items-center justify-between border-t-[3px] border-black bg-bg px-8 py-5">
      <div className="flex items-center space-x-3">
        <h1>Made by Batch B7</h1>
      </div>
      <div className="flex items-center space-x-3">
        <Link href={"/"}>
          <Button>Home</Button>
        </Link>
        {pathName.endsWith("/dashboard") ? (
          <></>
        ) : (
          <Link href={"/dashboard"}>
            <Button>Dashboard</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default PageFooter;
