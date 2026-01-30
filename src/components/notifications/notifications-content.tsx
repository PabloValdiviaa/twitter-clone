"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/header";
import { NotificationList } from "@/components/notifications/notification-list";
import { markNotificationsAsRead } from "@/actions/notification.actions";

export function NotificationsContent() {
  const [tab, setTab] = useState<"all" | "mentions">("all");

  useEffect(() => {
    markNotificationsAsRead();
  }, []);

  return (
    <div>
      <Header title="Notificaciones" />
      <Tabs value={tab} onValueChange={(v) => setTab(v as "all" | "mentions")}>
        <TabsList className="grid h-[53px] w-full grid-cols-2 rounded-none border-b border-border bg-transparent p-0">
          <TabsTrigger
            value="all"
            className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:font-bold"
          >
            Todas
          </TabsTrigger>
          <TabsTrigger
            value="mentions"
            className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:font-bold"
          >
            Menciones
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-0">
          <NotificationList filter="all" />
        </TabsContent>
        <TabsContent value="mentions" className="mt-0">
          <NotificationList filter="mentions" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
