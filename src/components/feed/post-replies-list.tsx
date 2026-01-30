"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostReplies } from "@/actions/post.actions";
import { PostCard } from "./post-card";
import { InfiniteScroll } from "@/components/shared/infinite-scroll";
import { Spinner } from "@/components/ui/spinner";

interface PostRepliesListProps {
  postId: string;
}

export function PostRepliesList({ postId }: PostRepliesListProps) {
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", "replies", postId],
      queryFn: ({ pageParam }) =>
        getPostReplies({ postId, cursor: pageParam }),
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

  const replies = data?.pages.flatMap((page) => page.data) ?? [];

  if (replies.length === 0) {
    return null;
  }

  return (
    <div>
      {replies.map((reply) => (
        <PostCard key={reply.id} post={reply} />
      ))}
      <InfiniteScroll
        hasNextPage={!!hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
}
