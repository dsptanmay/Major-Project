import { cn } from "@/lib/utils";
import React from "react";

function AlertCard({
  title,
  description,
  icon,
  variant,
}: {
  title: string;
  description: string;
  icon: React.JSX.Element;
  variant: "missing" | "error" | "status";
}) {
  const alertStyles = {
    missing: "bg-[#88aaee]",
    error: "bg-[#ff6b6b]",
    status: "bg-[#FFDC58]",
  };
  return (
    <div
      className={cn(
        "flex items-center space-x-5 border-2 border-border p-5 shadow-light",
        alertStyles[variant],
      )}
    >
      <>{icon}</>
      <div className="flex flex-col justify-center">
        <h1 className="text-lg font-heading">{title}</h1>
        <p className="font-base text-zinc-800">{description}</p>
      </div>
    </div>
  );
}

export default AlertCard;
