import React from "react";

function AlertComponent({
  title,
  description,
  variant,
}: {
  title: string;
  description: string;
  variant: "missing" | "error" | "status";
}) {
  const alertStyles = {
    missing: "bg-blue-300",
    error: "bg-red-300",
    status: "bg-yellow-200",
  };
  return <div>AlertComponent</div>;
}

export default AlertComponent;
