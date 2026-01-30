"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getTimeline } from "@/actions/post.actions";

export function useInfinitePosts(tab: "for-you" | "following" = "for-you") {
  return useInfiniteQuery({
    queryKey: ["posts", "timeline", tab],
    queryFn: ({ pageParam }) => getTimeline({ cursor: pageParam, tab }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
