import React from "react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center border-2 border-border bg-white bg-[radial-gradient(#80808080_1px,transparent_1px)] px-10 py-20 shadow-light [background-size:16px_16px]">
      <div className="flex flex-col items-center space-y-5">
        <h1 className="text-8xl font-bold">404</h1>
        <h3 className="text-2xl font-semibold">
          Sorry, we couldn't find this page!
        </h3>
        <h4 className="text-xl">
          Maybe try again in{" "}
          <a
            target="_blank"
            href="/dashboard"
            className="text-blue-700 hover:underline"
          >
            Dashboard
          </a>{" "}
          ?
        </h4>
      </div>
    </div>
  );
}
