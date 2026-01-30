"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PostWithAuthor } from "@/types";

type InfinitePostsData = {
  pages: { data: PostWithAuthor[]; nextCursor: string | null }[];
  pageParams: (string | undefined)[];
};

export function useOptimisticAction<TResult>({
  mutationFn,
  postId,
  updatePost,
  queryKeys = [["posts"]],
}: {
  mutationFn: () => Promise<TResult>;
  postId: string;
  updatePost: (post: PostWithAuthor) => PostWithAuthor;
  queryKeys?: string[][];
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot all matching queries
      const snapshots: { queryKey: string[]; data: unknown }[] = [];

      for (const key of queryKeys) {
        const queries = queryClient.getQueriesData<InfinitePostsData>({ queryKey: key });
        for (const [queryKey, data] of queries) {
          if (data) {
            snapshots.push({ queryKey: queryKey as string[], data });
            queryClient.setQueryData(queryKey, {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                data: page.data.map((post) =>
                  post.id === postId ? updatePost(post) : post,
                ),
              })),
            });
          }
        }
      }

      // Also update single post query
      const singlePost = queryClient.getQueryData<PostWithAuthor>(["posts", postId]);
      if (singlePost) {
        snapshots.push({ queryKey: ["posts", postId], data: singlePost });
        queryClient.setQueryData(["posts", postId], updatePost(singlePost));
      }

      return { snapshots };
    },
    onError: (_err, _vars, context) => {
      // Rollback on error
      if (context?.snapshots) {
        for (const { queryKey, data } of context.snapshots) {
          queryClient.setQueryData(queryKey, data);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
