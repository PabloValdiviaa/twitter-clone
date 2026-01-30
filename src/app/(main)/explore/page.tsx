"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { SearchBar } from "@/components/search/search-bar";
import { TrendingList } from "@/components/search/trending-list";
import { WhoToFollow } from "@/components/search/who-to-follow";
import { searchPosts, searchUsers } from "@/actions/search.actions";
import { PostCard } from "@/components/feed/post-card";
import { UserAvatar } from "@/components/shared/user-avatar";
import { FollowButton } from "@/components/profile/follow-button";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data: postResults, isLoading: postsLoading } = useQuery({
    queryKey: ["search", "posts", query],
    queryFn: () => searchPosts(query),
    enabled: query.length > 0,
  });

  const { data: userResults, isLoading: usersLoading } = useQuery({
    queryKey: ["search", "users", query],
    queryFn: () => searchUsers(query),
    enabled: query.length > 0,
  });

  const isLoading = postsLoading || usersLoading;
  const hasQuery = query.length > 0;

  return (
    <div>
      <Header title="Explorar" />
      <div className="px-4 py-3">
        <SearchBar defaultValue={query} />
      </div>

      {hasQuery ? (
        <div>
          {isLoading && (
            <div className="flex justify-center p-8">
              <Spinner />
            </div>
          )}

          {/* User results */}
          {userResults && userResults.length > 0 && (
            <div className="border-b border-border">
              <h3 className="px-4 py-2 font-bold">Personas</h3>
              {userResults.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/50"
                >
                  <Link href={`/${u.username || u.id}`}>
                    <UserAvatar name={u.name} image={u.image} />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/${u.username || u.id}`}
                      className="block truncate font-bold hover:underline"
                    >
                      {u.name}
                    </Link>
                    <p className="truncate text-sm text-muted-foreground">
                      @{u.username || "user"}
                    </p>
                    {u.bio && (
                      <p className="mt-1 text-sm line-clamp-2">{u.bio}</p>
                    )}
                  </div>
                  <FollowButton
                    userId={u.id}
                    isFollowing={u.isFollowing}
                    username={u.username}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Post results */}
          {postResults && postResults.length > 0 && (
            <div>
              <h3 className="px-4 py-2 font-bold">Publicaciones</h3>
              {postResults.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {!isLoading &&
            (!postResults || postResults.length === 0) &&
            (!userResults || userResults.length === 0) && (
              <div className="p-8 text-center">
                <p className="text-xl font-bold">
                  Sin resultados para &quot;{query}&quot;
                </p>
                <p className="mt-1 text-muted-foreground">
                  Intenta buscar otra cosa.
                </p>
              </div>
            )}
        </div>
      ) : (
        <div className="space-y-4 px-4">
          <TrendingList />
          <WhoToFollow />
        </div>
      )}
    </div>
  );
}
