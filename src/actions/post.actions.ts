"use server";

import { db } from "@/lib/db";
import { posts, likes, reposts, bookmarks, user, notifications } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth-session";
import { createPostSchema } from "@/lib/validators";
import { eq, desc, and, isNull, sql, lt, inArray } from "drizzle-orm";
import type { PostWithAuthor, CursorPaginationResult, ActionResult } from "@/types";
import { follows } from "@/lib/db/schema";

const POSTS_PER_PAGE = 20;

export async function createPost(
  input: { content: string; parentId?: string },
): Promise<ActionResult<PostWithAuthor>> {
  const session = await requireSession();
  const parsed = createPostSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { content, parentId } = parsed.data;

  const [newPost] = await db
    .insert(posts)
    .values({
      content,
      authorId: session.user.id,
      parentId: parentId || null,
    })
    .returning();

  // Create notification for reply
  if (parentId) {
    const parentPost = await db.query.posts.findFirst({
      where: eq(posts.id, parentId),
      columns: { authorId: true },
    });
    if (parentPost && parentPost.authorId !== session.user.id) {
      await db.insert(notifications).values({
        recipientId: parentPost.authorId,
        senderId: session.user.id,
        type: "reply",
        postId: newPost.id,
      });
    }
  }

  const postWithAuthor: PostWithAuthor = {
    ...newPost,
    author: {
      id: session.user.id,
      name: session.user.name,
      username: session.user.username as string | null,
      image: session.user.image ?? null,
    },
    _count: { likes: 0, reposts: 0, replies: 0 },
    isLiked: false,
    isReposted: false,
    isBookmarked: false,
  };

  return { success: true, data: postWithAuthor };
}

export async function deletePost(postId: string): Promise<ActionResult> {
  const session = await requireSession();

  const post = await db.query.posts.findFirst({
    where: and(eq(posts.id, postId), eq(posts.authorId, session.user.id)),
  });

  if (!post) {
    return { success: false, error: "Post not found or not authorized" };
  }

  await db.delete(posts).where(eq(posts.id, postId));
  return { success: true, data: undefined };
}

export async function getTimeline({
  cursor,
  tab = "for-you",
}: {
  cursor?: string;
  tab?: "for-you" | "following";
}): Promise<CursorPaginationResult<PostWithAuthor>> {
  const session = await requireSession();
  const currentUserId = session.user.id;

  // Build conditions
  const conditions = [isNull(posts.parentId)];

  if (cursor) {
    conditions.push(lt(posts.createdAt, new Date(cursor)));
  }

  if (tab === "following") {
    const userFollowing = await db
      .select({ followingId: follows.followingId })
      .from(follows)
      .where(eq(follows.followerId, currentUserId));

    const followingIds = userFollowing.map((f) => f.followingId);
    followingIds.push(currentUserId);

    if (followingIds.length > 0) {
      conditions.push(inArray(posts.authorId, followingIds));
    }
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
      likesCount: sql<number>`(SELECT COUNT(*) FROM likes WHERE likes.post_id = ${posts.id})`.as("likes_count"),
      repostsCount: sql<number>`(SELECT COUNT(*) FROM reposts WHERE reposts.post_id = ${posts.id})`.as("reposts_count"),
      repliesCount: sql<number>`(SELECT COUNT(*) FROM posts AS r WHERE r.parent_id = ${posts.id})`.as("replies_count"),
      isLiked: sql<boolean>`EXISTS(SELECT 1 FROM likes WHERE likes.post_id = ${posts.id} AND likes.user_id = ${currentUserId})`.as("is_liked"),
      isReposted: sql<boolean>`EXISTS(SELECT 1 FROM reposts WHERE reposts.post_id = ${posts.id} AND reposts.user_id = ${currentUserId})`.as("is_reposted"),
      isBookmarked: sql<boolean>`EXISTS(SELECT 1 FROM bookmarks WHERE bookmarks.post_id = ${posts.id} AND bookmarks.user_id = ${currentUserId})`.as("is_bookmarked"),
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
    nextCursor: hasMore
      ? data[data.length - 1].createdAt.toISOString()
      : null,
  };
}

// Internal version that accepts userId directly to avoid repeated requireSession calls
async function getPostByIdInternal(
  postId: string,
  currentUserId: string,
): Promise<PostWithAuthor | null> {
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
      isLiked: sql<boolean>`EXISTS(SELECT 1 FROM likes WHERE likes.post_id = ${posts.id} AND likes.user_id = ${currentUserId})`,
      isReposted: sql<boolean>`EXISTS(SELECT 1 FROM reposts WHERE reposts.post_id = ${posts.id} AND reposts.user_id = ${currentUserId})`,
      isBookmarked: sql<boolean>`EXISTS(SELECT 1 FROM bookmarks WHERE bookmarks.post_id = ${posts.id} AND bookmarks.user_id = ${currentUserId})`,
    })
    .from(posts)
    .innerJoin(user, eq(posts.authorId, user.id))
    .where(eq(posts.id, postId))
    .limit(1);

  if (results.length === 0) return null;

  const row = results[0];
  return {
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
  };
}

export async function getPostById(
  postId: string,
): Promise<PostWithAuthor | null> {
  const session = await requireSession();
  return getPostByIdInternal(postId, session.user.id);
}

export async function getPostReplies({
  postId,
  cursor,
}: {
  postId: string;
  cursor?: string;
}): Promise<CursorPaginationResult<PostWithAuthor>> {
  const session = await requireSession();
  const currentUserId = session.user.id;

  const conditions = [eq(posts.parentId, postId)];
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
      isLiked: sql<boolean>`EXISTS(SELECT 1 FROM likes WHERE likes.post_id = ${posts.id} AND likes.user_id = ${currentUserId})`,
      isReposted: sql<boolean>`EXISTS(SELECT 1 FROM reposts WHERE reposts.post_id = ${posts.id} AND reposts.user_id = ${currentUserId})`,
      isBookmarked: sql<boolean>`EXISTS(SELECT 1 FROM bookmarks WHERE bookmarks.post_id = ${posts.id} AND bookmarks.user_id = ${currentUserId})`,
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
    nextCursor: hasMore
      ? data[data.length - 1].createdAt.toISOString()
      : null,
  };
}

export async function getPostWithThread(postId: string) {
  const session = await requireSession();
  const currentUserId = session.user.id;

  const post = await getPostByIdInternal(postId, currentUserId);
  if (!post) return null;

  // Build parent chain (reuses session, no repeated auth checks)
  const parents: PostWithAuthor[] = [];
  let currentParentId = post.parentId;
  while (currentParentId) {
    const parent = await getPostByIdInternal(currentParentId, currentUserId);
    if (!parent) break;
    parents.unshift(parent);
    currentParentId = parent.parentId;
  }

  return { post, parents };
}
