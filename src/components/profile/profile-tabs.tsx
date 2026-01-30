"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserPosts } from "@/actions/profile.actions";
import { PostCard } from "@/components/feed/post-card";
import { InfiniteScroll } from "@/components/shared/infinite-scroll";
import { Spinner } from "@/components/ui/spinner";

interface ProfileTabsProps {
  userId: string;
}

function ProfilePostList({
  userId,
  tab,
}: {
  userId: string;
  tab: "posts" | "replies" | "likes";
}) {
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", "user", userId, tab],
      queryFn: ({ pageParam }) =>
        getUserPosts({ userId, cursor: pageParam, tab }),
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

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  if (posts.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        {tab === "posts"
          ? "Aún no hay publicaciones."
          : tab === "replies"
            ? "Aún no hay respuestas."
            : "Aún no hay me gusta."}
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <InfiniteScroll
        hasNextPage={!!hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
}

export function ProfileTabs({ userId }: ProfileTabsProps) {
  const [tab, setTab] = useState<"posts" | "replies" | "likes">("posts");

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
      <TabsList className="grid h-[53px] w-full grid-cols-3 rounded-none border-b border-border bg-transparent p-0">
        <TabsTrigger
          value="posts"
          className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:font-bold"
        >
          Publicaciones
        </TabsTrigger>
        <TabsTrigger
          value="replies"
          className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:font-bold"
        >
          Respuestas
        </TabsTrigger>
        <TabsTrigger
          value="likes"
          className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:font-bold"
        >
          Me gusta
        </TabsTrigger>
      </TabsList>
      <TabsContent value="posts" className="mt-0">
        <ProfilePostList userId={userId} tab="posts" />
      </TabsContent>
      <TabsContent value="replies" className="mt-0">
        <ProfilePostList userId={userId} tab="replies" />
      </TabsContent>
      <TabsContent value="likes" className="mt-0">
        <ProfilePostList userId={userId} tab="likes" />
      </TabsContent>
    </Tabs>
  );
}
