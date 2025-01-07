"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";

import { useQueryClient } from "@tanstack/react-query";
import { useGetWriteEvents } from "@/hooks/history/use-get-write-events";

function WriteEventsTable() {
  const { user } = useUser();
  const { data, status } = useGetWriteEvents(user?.id);

  if (status === "pending")
    return <Skeleton className="w-full border-2 border-border"></Skeleton>;
  if (status === "error") return <div>Error</div>; // TODO : replace with proper error component
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[45%]">Action</TableHead>
          <TableHead className="w-[35%]">Transaction Hash</TableHead>
          <TableHead className="w-[20%]">Performed At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{record.description}</TableCell>
            <TableCell>{record.transaction_hash}</TableCell>
            <TableCell>
              {format(new Date(record.performed_at), "HH:m a, do MMM")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function WriteEventsCard() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Write Events</CardTitle>
        <CardDescription>
          A list of recent write events performed by you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <WriteEventsTable />
      </CardContent>
      <CardFooter className="flex w-full justify-end">
        <Button
          variant="noShadow"
          className="bg-[#FEF2E8] font-base"
          onClick={() => {
            queryClient.invalidateQueries({
              queryKey: ["get-write-events", { id: user?.id }],
            });
          }}
        >
          Refresh data
        </Button>
      </CardFooter>
    </Card>
  );
}

export default WriteEventsCard;
