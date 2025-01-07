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

import { useGetReadEvents } from "@/hooks/history/use-get-read-events";

function ReadEventsTable({ userId }: { userId: string }) {
  const { data, status } = useGetReadEvents(userId);

  if (status === "pending")
    return (
      <Skeleton className="w-full border-2 border-border px-5 py-10"></Skeleton>
    );
  if (status === "error") return <div>Error</div>; // TODO : replace with proper error component

  if (data.length === 0)
    return (
      <div className="flex items-center justify-center border-2 border-border py-3 font-base">
        No read events so far!
      </div>
    );
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[70%]">Action</TableHead>
          <TableHead className="w-[30%]">Performed At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{record.description}</TableCell>
            <TableCell>
              {format(new Date(record.performed_at), "HH:m a, do MMM")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ReadEventsCard() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Read Events</CardTitle>
        <CardDescription>
          A list of recent read events performed on your documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReadEventsTable userId={user?.id!} />
      </CardContent>
      <CardFooter className="flex w-full justify-end">
        <Button
          variant="noShadow"
          className="bg-[#FEF2E8] font-base"
          onClick={() => {
            queryClient.invalidateQueries({
              queryKey: ["get-read-events", { id: user?.id }],
            });
          }}
        >
          Refresh data
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ReadEventsCard;
