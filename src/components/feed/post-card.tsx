"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { PostWithAuthor } from "@/types";
import { UserAvatar } from "@/components/shared/user-avatar";
import { PostActions } from "./post-actions";
import { formatRelativeTime } from "@/lib/utils";

interface PostCardProps {
  post: PostWithAuthor;
}

export function PostCard({ post }: PostCardProps) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    setTimeAgo(formatRelativeTime(post.createdAt));
    const interval = setInterval(() => {
      setTimeAgo(formatRelativeTime(post.createdAt));
    }, 60000);
    return () => clearInterval(interval);
  }, [post.createdAt]);

  return (
    <article className="border-b border-border px-4 py-3 transition-colors hover:bg-accent/50">
      <div className="flex gap-3">
        <Link href={`/${post.author.username || post.author.id}`}>
          <UserAvatar
            name={post.author.name}
            image={post.author.image}
            className="h-10 w-10"
          />
        </Link>
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="flex items-center gap-1 text-sm">
            <Link
              href={`/${post.author.username || post.author.id}`}
              className="truncate font-bold hover:underline"
            >
              {post.author.name}
            </Link>
            <Link
              href={`/${post.author.username || post.author.id}`}
              className="truncate text-muted-foreground"
            >
              @{post.author.username || "user"}
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link
              href={`/post/${post.id}`}
              className="text-muted-foreground hover:underline"
            >
              {timeAgo}
            </Link>
          </div>

          {/* Content */}
          <Link href={`/post/${post.id}`}>
            <p className="mt-1 whitespace-pre-wrap break-words text-[15px]">
              {post.content}
            </p>
          </Link>

          {/* Actions */}
          <PostActions post={post} />
        </div>
      </div>
    </article>
  );
}
