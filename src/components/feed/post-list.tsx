"use client";

import { useInfinitePosts } from "@/hooks/use-infinite-posts";
import { PostCard } from "./post-card";
import { InfiniteScroll } from "@/components/shared/infinite-scroll";
import { Spinner } from "@/components/ui/spinner";

interface PostListProps {
  tab: "for-you" | "following";
}

export function PostList({ tab }: PostListProps) {
  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfinitePosts(tab);

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
        <p className="text-xl font-bold">
          {tab === "following"
            ? "Aún no hay publicaciones de personas que sigues"
            : "Aún no hay publicaciones"}
        </p>
        <p className="mt-1 text-muted-foreground">
          {tab === "following"
            ? "Sigue a algunas personas para ver sus publicaciones aquí."
            : "¡Sé el primero en publicar algo!"}
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
