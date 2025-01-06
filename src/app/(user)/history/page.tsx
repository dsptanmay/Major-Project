import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function ReadEventsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Read Events</CardTitle>
        <CardDescription>
          A list of recent read events performed on your documents
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function WriteEventsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Write Events</CardTitle>
        <CardDescription>
          A list of recent write events performed by you
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function HistoryPage() {
  return (
    <div className="flex w-full max-w-6xl items-center justify-center border-2 border-border bg-white px-5 py-10 shadow-light">
      <Tabs defaultValue="read" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="read">Read Events</TabsTrigger>
          <TabsTrigger value="write">Write Events</TabsTrigger>
        </TabsList>
        <TabsContent value="read">
          <ReadEventsTab />
        </TabsContent>
        <TabsContent value="write">
          <WriteEventsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default HistoryPage;
