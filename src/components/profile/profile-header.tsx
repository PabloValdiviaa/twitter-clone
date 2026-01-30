"use client";

import { CalendarDays, MapPin, Link as LinkIcon } from "lucide-react";
import type { ProfileWithStats } from "@/types";
import { UserAvatar } from "@/components/shared/user-avatar";
import { FollowButton } from "./follow-button";
import { EditProfileDialog } from "./edit-profile-dialog";

interface ProfileHeaderProps {
  profile: ProfileWithStats;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const joinDate = new Date(profile.createdAt).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      {/* Banner */}
      <div className="h-[200px] bg-muted">
        {profile.bannerImage && (
          <img
            src={profile.bannerImage}
            alt="Banner"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Avatar + Actions */}
      <div className="relative px-4 pb-3">
        <div className="flex items-end justify-between">
          <div className="-mt-[68px]">
            <UserAvatar
              name={profile.name}
              image={profile.image}
              className="h-[134px] w-[134px] border-4 border-background text-4xl"
            />
          </div>
          <div className="mt-3">
            {profile.isOwnProfile ? (
              <EditProfileDialog profile={profile} />
            ) : (
              <FollowButton
                userId={profile.id}
                isFollowing={profile.isFollowing}
                username={profile.username}
              />
            )}
          </div>
        </div>

        {/* Name + Username */}
        <div className="mt-2">
          <h2 className="text-xl font-bold">{profile.name}</h2>
          <p className="text-muted-foreground">
            @{profile.username || "user"}
          </p>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="mt-3 whitespace-pre-wrap">{profile.bio}</p>
        )}

        {/* Meta */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {profile.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {profile.location}
            </span>
          )}
          {profile.website && (
            <a
              href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <LinkIcon className="h-4 w-4" />
              {profile.website.replace(/^https?:\/\//, "")}
            </a>
          )}
          <span className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            Se unió en {joinDate}
          </span>
        </div>

        {/* Stats */}
        <div className="mt-3 flex gap-4 text-sm">
          <span>
            <strong>{profile._count.following}</strong>{" "}
            <span className="text-muted-foreground">Siguiendo</span>
          </span>
          <span>
            <strong>{profile._count.followers}</strong>{" "}
            <span className="text-muted-foreground">Seguidores</span>
          </span>
        </div>
      </div>
    </div>
  );
}
