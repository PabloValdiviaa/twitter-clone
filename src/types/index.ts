import type { InferSelectModel } from "drizzle-orm";
import type { user, posts, notifications } from "@/lib/db/schema";

// Base types derived from schema
export type User = InferSelectModel<typeof user>;
export type Post = InferSelectModel<typeof posts>;
export type Notification = InferSelectModel<typeof notifications>;

// Post with author and interaction counts
export type PostWithAuthor = Post & {
  author: Pick<User, "id" | "name" | "username" | "image">;
  _count: {
    likes: number;
    reposts: number;
    replies: number;
  };
  isLiked: boolean;
  isReposted: boolean;
  isBookmarked: boolean;
};

// Profile with follower/following stats
export type ProfileWithStats = User & {
  _count: {
    followers: number;
    following: number;
    posts: number;
  };
  isFollowing: boolean;
  isOwnProfile: boolean;
};

// Notification with sender and post details
export type NotificationWithDetails = Notification & {
  sender: Pick<User, "id" | "name" | "username" | "image">;
  post: Pick<Post, "id" | "content"> | null;
};

// Cursor-based pagination
export type CursorPaginationResult<T> = {
  data: T[];
  nextCursor: string | null;
};

// Server action result
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
