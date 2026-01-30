"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostList } from "./post-list";
import { useCurrentUser } from "@/hooks/use-current-user";

export function TimelineTabs() {
  const [tab, setTab] = useState<"for-you" | "following">("for-you");
  const { isAuthenticated } = useCurrentUser();

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => setTab(v as "for-you" | "following")}
      className="w-full"
    >
      <TabsList
        className={`grid h-[53px] w-full rounded-none border-b border-border bg-transparent p-0 ${
          isAuthenticated ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        <TabsTrigger
          value="for-you"
          className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:font-bold"
        >
          Para ti
        </TabsTrigger>
        {isAuthenticated && (
          <TabsTrigger
            value="following"
            className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:font-bold"
          >
            Siguiendo
          </TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="for-you" className="mt-0">
        <PostList tab="for-you" />
      </TabsContent>
      {isAuthenticated && (
        <TabsContent value="following" className="mt-0">
          <PostList tab="following" />
        </TabsContent>
      )}
    </Tabs>
  );
}
