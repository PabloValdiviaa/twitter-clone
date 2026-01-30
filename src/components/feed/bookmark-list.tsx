"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getBookmarks } from "@/actions/bookmark.actions";
import { PostCard } from "./post-card";
import { InfiniteScroll } from "@/components/shared/infinite-scroll";
import { Spinner } from "@/components/ui/spinner";

export function BookmarkList() {
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", "bookmarks"],
      queryFn: ({ pageParam }) => getBookmarks({ cursor: pageParam }),
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
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-xl font-bold">Guarda publicaciones para después</p>
        <p className="mt-1 text-muted-foreground">
          Guarda publicaciones para encontrarlas fácilmente en el futuro.
        </p>
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
