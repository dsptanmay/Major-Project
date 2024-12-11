"use client";
import React, { useEffect } from "react";

function OrganizationViewPage({ params }: { params: { token_id: string } }) {
  const token_id = params.token_id;
  useEffect(() => {}, []);
  return (
    <div className="rounded-none border-[3px] border-border bg-white shadow-light">
      OrganizationViewPage
    </div>
  );
}

export default OrganizationViewPage;
