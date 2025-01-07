import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReadEventsCard from "@/components/read-events-tab";
import WriteEventsCard from "@/components/write-events-tab";

function HistoryPage() {
  return (
    <div className="flex w-full max-w-6xl items-center justify-center border-2 border-border bg-white px-5 py-10 shadow-light">
      <Tabs defaultValue="read" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="read">Read Events</TabsTrigger>
          <TabsTrigger value="write">Write Events</TabsTrigger>
        </TabsList>
        <TabsContent value="read">
          <ReadEventsCard />
        </TabsContent>
        <TabsContent value="write">
          <WriteEventsCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default HistoryPage;
