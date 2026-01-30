"use server";

import { db } from "@/lib/db";
import { bookmarks, posts, user } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth-session";
import { and, eq, desc, lt, sql } from "drizzle-orm";
import type { ActionResult, PostWithAuthor, CursorPaginationResult } from "@/types";
import { likes, reposts } from "@/lib/db/schema";

const POSTS_PER_PAGE = 20;

export async function toggleBookmark(postId: string): Promise<ActionResult<{ bookmarked: boolean }>> {
  const session = await requireSession();
  const userId = session.user.id;

  const existing = await db.query.bookmarks.findFirst({
    where: and(eq(bookmarks.userId, userId), eq(bookmarks.postId, postId)),
  });

  if (existing) {
    await db
      .delete(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.postId, postId)));
    return { success: true, data: { bookmarked: false } };
  }

  await db.insert(bookmarks).values({ userId, postId });
  return { success: true, data: { bookmarked: true } };
}

export async function getBookmarks({
  cursor,
}: {
  cursor?: string;
}): Promise<CursorPaginationResult<PostWithAuthor>> {
  const session = await requireSession();
  const currentUserId = session.user.id;

  const conditions = [eq(bookmarks.userId, currentUserId)];
  if (cursor) {
    conditions.push(lt(bookmarks.createdAt, new Date(cursor)));
  }

  const results = await db
    .select({
      bookmarkCreatedAt: bookmarks.createdAt,
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
    })
    .from(bookmarks)
    .innerJoin(posts, eq(bookmarks.postId, posts.id))
    .innerJoin(user, eq(posts.authorId, user.id))
    .where(and(...conditions))
    .orderBy(desc(bookmarks.createdAt))
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
    isBookmarked: true,
  }));

  return {
    data,
    nextCursor: hasMore
      ? results[POSTS_PER_PAGE - 1].bookmarkCreatedAt.toISOString()
      : null,
  };
}
