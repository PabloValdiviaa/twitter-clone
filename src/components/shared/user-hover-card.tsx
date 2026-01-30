"use client";

import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { UserAvatar } from "./user-avatar";
import { FollowButton } from "@/components/profile/follow-button";

interface UserHoverCardProps {
  children: React.ReactNode;
  user: {
    id: string;
    name: string;
    username?: string | null;
    image?: string | null;
    bio?: string | null;
  };
  isFollowing?: boolean;
  isOwnProfile?: boolean;
}

export function UserHoverCard({
  children,
  user,
  isFollowing = false,
  isOwnProfile = false,
}: UserHoverCardProps) {
  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-[300px]" side="bottom" align="start">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <Link href={`/${user.username || user.id}`}>
              <UserAvatar
                name={user.name}
                image={user.image}
                className="h-14 w-14"
              />
            </Link>
            {!isOwnProfile && (
              <FollowButton
                userId={user.id}
                isFollowing={isFollowing}
                username={user.username}
              />
            )}
          </div>
          <div>
            <Link
              href={`/${user.username || user.id}`}
              className="font-bold hover:underline"
            >
              {user.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              @{user.username || "user"}
            </p>
          </div>
          {user.bio && (
            <p className="text-sm">{user.bio}</p>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
