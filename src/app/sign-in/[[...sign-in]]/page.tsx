import { SignIn } from "@clerk/nextjs";
import React from "react";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center border-2 border-border bg-white bg-[radial-gradient(#80808080_1px,transparent_1px)] px-10 py-20 shadow-light [background-size:16px_16px]">
      <SignIn />
    </div>
  );
}
