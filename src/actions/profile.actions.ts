"use server";

import { db } from "@/lib/db";
import { user, posts, follows, likes, reposts, bookmarks } from "@/lib/db/schema";
import { getSession, requireSession } from "@/lib/auth-session";
import { updateProfileSchema } from "@/lib/validators";
import { eq, and, desc, lt, sql, or } from "drizzle-orm";
import type { ProfileWithStats, PostWithAuthor, CursorPaginationResult, ActionResult } from "@/types";

const POSTS_PER_PAGE = 20;

export async function getProfile(username: string): Promise<ProfileWithStats | null> {
  const session = await getSession();
  const currentUserId = session?.user?.id ?? null;

  const userRecord = await db.query.user.findFirst({
    where: or(eq(user.username, username), eq(user.id, username)),
  });

  if (!userRecord) return null;

  const [stats] = await db
    .select({
      followersCount: sql<number>`(SELECT COUNT(*) FROM follows WHERE follows.following_id = ${userRecord.id})`,
      followingCount: sql<number>`(SELECT COUNT(*) FROM follows WHERE follows.follower_id = ${userRecord.id})`,
      postsCount: sql<number>`(SELECT COUNT(*) FROM posts WHERE posts.author_id = ${userRecord.id} AND posts.parent_id IS NULL)`,
      isFollowing: currentUserId
        ? sql<boolean>`EXISTS(SELECT 1 FROM follows WHERE follows.follower_id = ${currentUserId} AND follows.following_id = ${userRecord.id})`
        : sql<boolean>`false`,
    })
    .from(user)
    .where(eq(user.id, userRecord.id));

  return {
    ...userRecord,
    _count: {
      followers: Number(stats.followersCount),
      following: Number(stats.followingCount),
      posts: Number(stats.postsCount),
    },
    isFollowing: Boolean(stats.isFollowing),
    isOwnProfile: currentUserId ? userRecord.id === currentUserId : false,
  };
}

export async function setUsername(username: string): Promise<ActionResult> {
  const session = await requireSession();

  // Check if username is already taken
  const existing = await db.query.user.findFirst({
    where: eq(user.username, username),
  });

  if (existing && existing.id !== session.user.id) {
    return { success: false, error: "Username is already taken" };
  }

  await db
    .update(user)
    .set({ username })
    .where(eq(user.id, session.user.id));

  return { success: true, data: undefined };
}

export async function updateProfile(
  input: { name: string; bio?: string; location?: string; website?: string },
): Promise<ActionResult> {
  const session = await requireSession();
  const parsed = updateProfileSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  await db
    .update(user)
    .set({
      name: parsed.data.name,
      bio: parsed.data.bio || null,
      location: parsed.data.location || null,
      website: parsed.data.website || null,
      image: parsed.data.image || null,
      bannerImage: parsed.data.bannerImage || null,
    })
    .where(eq(user.id, session.user.id));

  return { success: true, data: undefined };
}

export async function getUserPosts({
  userId,
  cursor,
  tab = "posts",
}: {
  userId: string;
  cursor?: string;
  tab?: "posts" | "replies" | "likes";
}): Promise<CursorPaginationResult<PostWithAuthor>> {
  const session = await getSession();
  const currentUserId = session?.user?.id ?? null;

  if (tab === "likes") {
    return getUserLikedPosts({ userId, cursor, currentUserId });
  }

  const conditions = [eq(posts.authorId, userId)];
  if (tab === "posts") {
    conditions.push(sql`${posts.parentId} IS NULL`);
  }
  if (cursor) {
    conditions.push(lt(posts.createdAt, new Date(cursor)));
  }

  const results = await db
    .select({
      id: posts.id,
      content: posts.content,
      authorId: posts.authorId,
      parentId: posts.parentId,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      authorName: user.name,
      authorUsername: user.username,
      authorImage: user.image,
      likesCount: sql<number>`(SELECT COUNT(*) FROM likes WHERE likes.post_id = ${posts.id})`,
      repostsCount: sql<number>`(SELECT COUNT(*) FROM reposts WHERE reposts.post_id = ${posts.id})`,
      repliesCount: sql<number>`(SELECT COUNT(*) FROM posts AS r WHERE r.parent_id = ${posts.id})`,
      isLiked: currentUserId
        ? sql<boolean>`EXISTS(SELECT 1 FROM likes WHERE likes.post_id = ${posts.id} AND likes.user_id = ${currentUserId})`
        : sql<boolean>`false`,
      isReposted: currentUserId
        ? sql<boolean>`EXISTS(SELECT 1 FROM reposts WHERE reposts.post_id = ${posts.id} AND reposts.user_id = ${currentUserId})`
        : sql<boolean>`false`,
      isBookmarked: currentUserId
        ? sql<boolean>`EXISTS(SELECT 1 FROM bookmarks WHERE bookmarks.post_id = ${posts.id} AND bookmarks.user_id = ${currentUserId})`
        : sql<boolean>`false`,
    })
    .from(posts)
    .innerJoin(user, eq(posts.authorId, user.id))
    .where(and(...conditions))
    .orderBy(desc(posts.createdAt))
    .limit(POSTS_PER_PAGE + 1);

  const hasMore = results.length > POSTS_PER_PAGE;
  const data = results.slice(0, POSTS_PER_PAGE).map((row) => ({
    id: row.id,
    content: row.content,
    authorId: row.authorId,
    parentId: row.parentId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    author: {
      id: row.authorId,
      name: row.authorName,
      username: row.authorUsername,
      image: row.authorImage,
    },
    _count: {
      likes: Number(row.likesCount),
      reposts: Number(row.repostsCount),
      replies: Number(row.repliesCount),
    },
    isLiked: Boolean(row.isLiked),
    isReposted: Boolean(row.isReposted),
    isBookmarked: Boolean(row.isBookmarked),
  }));

  return {
    data,
    nextCursor: hasMore ? data[data.length - 1].createdAt.toISOString() : null,
  };
}

async function getUserLikedPosts({
  userId,
  cursor,
  currentUserId,
}: {
  userId: string;
  cursor?: string;
  currentUserId: string | null;
}): Promise<CursorPaginationResult<PostWithAuthor>> {
  const conditions = [eq(likes.userId, userId)];
  if (cursor) {
    conditions.push(lt(likes.createdAt, new Date(cursor)));
  }

  const results = await db
    .select({
      likeCreatedAt: likes.createdAt,
      id: posts.id,
      content: posts.content,
      authorId: posts.authorId,
      parentId: posts.parentId,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      authorName: user.name,
      authorUsername: user.username,
      authorImage: user.image,
      likesCount: sql<number>`(SELECT COUNT(*) FROM likes WHERE likes.post_id = ${posts.id})`,
      repostsCount: sql<number>`(SELECT COUNT(*) FROM reposts WHERE reposts.post_id = ${posts.id})`,
      repliesCount: sql<number>`(SELECT COUNT(*) FROM posts AS r WHERE r.parent_id = ${posts.id})`,
      isLiked: currentUserId
        ? sql<boolean>`EXISTS(SELECT 1 FROM likes WHERE likes.post_id = ${posts.id} AND likes.user_id = ${currentUserId})`
        : sql<boolean>`false`,
      isReposted: currentUserId
        ? sql<boolean>`EXISTS(SELECT 1 FROM reposts WHERE reposts.post_id = ${posts.id} AND reposts.user_id = ${currentUserId})`
        : sql<boolean>`false`,
      isBookmarked: currentUserId
        ? sql<boolean>`EXISTS(SELECT 1 FROM bookmarks WHERE bookmarks.post_id = ${posts.id} AND bookmarks.user_id = ${currentUserId})`
        : sql<boolean>`false`,
    })
    .from(likes)
    .innerJoin(posts, eq(likes.postId, posts.id))
    .innerJoin(user, eq(posts.authorId, user.id))
    .where(and(...conditions))
    .orderBy(desc(likes.createdAt))
    .limit(POSTS_PER_PAGE + 1);

  const hasMore = results.length > POSTS_PER_PAGE;
  const data = results.slice(0, POSTS_PER_PAGE).map((row) => ({
    id: row.id,
    content: row.content,
    authorId: row.authorId,
    parentId: row.parentId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    author: {
      id: row.authorId,
      name: row.authorName,
      username: row.authorUsername,
      image: row.authorImage,
    },
    _count: {
      likes: Number(row.likesCount),
      reposts: Number(row.repostsCount),
      replies: Number(row.repliesCount),
    },
    isLiked: Boolean(row.isLiked),
    isReposted: Boolean(row.isReposted),
    isBookmarked: Boolean(row.isBookmarked),
  }));

  return {
    data,
    nextCursor: hasMore
      ? results[POSTS_PER_PAGE - 1].likeCreatedAt.toISOString()
      : null,
  };
}
