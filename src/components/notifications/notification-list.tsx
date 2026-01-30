"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotifications } from "@/actions/notification.actions";
import { NotificationItem } from "./notification-item";
import { InfiniteScroll } from "@/components/shared/infinite-scroll";
import { Spinner } from "@/components/ui/spinner";

interface NotificationListProps {
  filter: "all" | "mentions";
}

export function NotificationList({ filter }: NotificationListProps) {
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["notifications", filter],
      queryFn: ({ pageParam }) =>
        getNotifications({ cursor: pageParam, filter }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  const notifications = data?.pages.flatMap((page) => page.data) ?? [];

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-xl font-bold">Nada que ver aquí — aún</p>
        <p className="mt-1 text-muted-foreground">
          {filter === "mentions"
            ? "Cuando alguien te mencione, aparecerá aquí."
            : "Los me gusta, reposts, respuestas y seguidores aparecerán aquí."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
      <InfiniteScroll
        hasNextPage={!!hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
}
