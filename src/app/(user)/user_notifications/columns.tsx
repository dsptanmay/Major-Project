"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Notification = {
  org_name: string;
  org_address: string;
  token_id: string;
  comments: string;
};

export const columns: ColumnDef<Notification>[] = [
  { accessorKey: "org_name", header: "Org Name" },
  { accessorKey: "org_address", header: "Org Address" },
  { accessorKey: "token_id", header: "Token ID" },
  { accessorKey: "comments", header: "Comments" },
];
