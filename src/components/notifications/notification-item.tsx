"use client";

import Link from "next/link";
import { Heart, Repeat2, MessageCircle, UserPlus } from "lucide-react";
import { UserAvatar } from "@/components/shared/user-avatar";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { NotificationWithDetails } from "@/types";

const typeConfig = {
  like: {
    icon: Heart,
    color: "text-pink-500",
    fill: true,
    message: "le dio me gusta a tu publicación",
  },
  repost: {
    icon: Repeat2,
    color: "text-green-500",
    fill: false,
    message: "reposteó tu publicación",
  },
  reply: {
    icon: MessageCircle,
    color: "text-blue-500",
    fill: false,
    message: "respondió a tu publicación",
  },
  follow: {
    icon: UserPlus,
    color: "text-primary",
    fill: false,
    message: "te siguió",
  },
  mention: {
    icon: MessageCircle,
    color: "text-blue-500",
    fill: false,
    message: "te mencionó",
  },
};

interface NotificationItemProps {
  notification: NotificationWithDetails;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const config = typeConfig[notification.type as keyof typeof typeConfig] || typeConfig.like;
  const Icon = config.icon;

  const href = notification.post
    ? `/post/${notification.post.id}`
    : `/${notification.sender.username || notification.sender.id}`;

  return (
    <Link href={href}>
      <article
        className={cn(
          "flex gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-accent/50",
          !notification.isRead && "bg-primary/5",
        )}
      >
        <div className={cn("mt-1", config.color)}>
          <Icon
            className="h-5 w-5"
            fill={config.fill ? "currentColor" : "none"}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <UserAvatar
              name={notification.sender.name}
              image={notification.sender.image}
              className="h-8 w-8"
            />
          </div>
          <p className="mt-1 text-sm">
            <span className="font-bold">{notification.sender.name}</span>{" "}
            {config.message}
          </p>
          {notification.post && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {notification.post.content}
            </p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            {formatRelativeTime(notification.createdAt)}
          </p>
        </div>
      </article>
    </Link>
  );
}
