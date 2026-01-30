"use server";

import { db } from "@/lib/db";
import { posts, user, follows, likes, reposts, bookmarks } from "@/lib/db/schema";
import { getSession } from "@/lib/auth-session";
import { eq, desc, sql, ilike, and, ne } from "drizzle-orm";
import type { PostWithAuthor } from "@/types";

export async function searchPosts(query: string): Promise<PostWithAuthor[]> {
  if (!query.trim()) return [];

  const session = await getSession();
  const currentUserId = session?.user?.id ?? null;

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
    .where(ilike(posts.content, `%${query}%`))
    .orderBy(desc(posts.createdAt))
    .limit(20);

  return results.map((row) => ({
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
}

export async function searchUsers(query: string) {
  if (!query.trim()) return [];

  const session = await getSession();
  const currentUserId = session?.user?.id ?? null;

  const results = await db
    .select({
      id: user.id,
      name: user.name,
      username: user.username,
      image: user.image,
      bio: user.bio,
      isFollowing: currentUserId
        ? sql<boolean>`EXISTS(
            SELECT 1 FROM follows
            WHERE follows.follower_id = ${currentUserId}
            AND follows.following_id = ${user.id}
          )`
        : sql<boolean>`false`,
    })
    .from(user)
    .where(
      sql`(${ilike(user.name, `%${query}%`)} OR ${ilike(user.username, `%${query}%`)})`,
    )
    .limit(10);

  return results.map((r) => ({
    ...r,
    isFollowing: Boolean(r.isFollowing),
  }));
}

export async function getTrending() {
  const results = await db.execute(sql`
    SELECT
      lower(matches[1]) as topic,
      COUNT(DISTINCT posts.id)::int as post_count,
      COALESCE(SUM(engagement.total), 0)::int as engagement
    FROM posts,
    LATERAL regexp_matches(posts.content, '#([a-zA-ZÀ-ÿ0-9_]+)', 'g') as matches
    LEFT JOIN LATERAL (
      SELECT
        (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id)
        + (SELECT COUNT(*) FROM reposts WHERE reposts.post_id = posts.id) as total
    ) engagement ON true
    WHERE posts.created_at > NOW() - INTERVAL '7 days'
      AND posts.parent_id IS NULL
    GROUP BY lower(matches[1])
    HAVING COUNT(DISTINCT posts.id) >= 2
    ORDER BY COUNT(DISTINCT posts.id) + COALESCE(SUM(engagement.total), 0) DESC
    LIMIT 5
  `);

  const rows = results.rows as Array<{ topic: string; post_count: number }>;

  return rows.map((row) => ({
    topic: `#${row.topic}`,
    count: Number(row.post_count),
  }));
}

export async function getWhoToFollow() {
  const session = await getSession();
  const currentUserId = session?.user?.id ?? null;

  if (currentUserId) {
    const results = await db
      .select({
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
        bio: user.bio,
      })
      .from(user)
      .where(
        and(
          ne(user.id, currentUserId),
          sql`NOT EXISTS(
            SELECT 1 FROM follows
            WHERE follows.follower_id = ${currentUserId}
            AND follows.following_id = ${user.id}
          )`,
        ),
      )
      .orderBy(sql`RANDOM()`)
      .limit(3);

    return results;
  }

  // Not authenticated: show random users
  const results = await db
    .select({
      id: user.id,
      name: user.name,
      username: user.username,
      image: user.image,
      bio: user.bio,
    })
    .from(user)
    .orderBy(sql`RANDOM()`)
    .limit(3);

  return results;
}
