"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getWhoToFollow } from "@/actions/search.actions";
import { UserAvatar } from "@/components/shared/user-avatar";
import { FollowButton } from "@/components/profile/follow-button";

export function WhoToFollow() {
  const { data: users } = useQuery({
    queryKey: ["who-to-follow"],
    queryFn: () => getWhoToFollow(),
    staleTime: 5 * 60 * 1000,
  });

  if (!users || users.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-muted">
      <h2 className="px-4 pt-4 text-xl font-bold">A quién seguir</h2>
      {users.map((u) => (
        <div
          key={u.id}
          className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/50"
        >
          <Link href={`/${u.username || u.id}`}>
            <UserAvatar
              name={u.name}
              image={u.image}
              className="h-10 w-10"
            />
          </Link>
          <div className="min-w-0 flex-1">
            <Link
              href={`/${u.username || u.id}`}
              className="block truncate font-bold text-sm hover:underline"
            >
              {u.name}
            </Link>
            <p className="truncate text-sm text-muted-foreground">
              @{u.username || "user"}
            </p>
          </div>
          <FollowButton userId={u.id} isFollowing={false} username={u.username} />
        </div>
      ))}
    </div>
  );
}
