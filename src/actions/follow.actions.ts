"use server";

import { db } from "@/lib/db";
import { follows, notifications, user } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth-session";
import { and, eq, desc, sql } from "drizzle-orm";
import type { ActionResult } from "@/types";

export async function toggleFollow(userId: string): Promise<ActionResult<{ following: boolean }>> {
  const session = await requireSession();
  const currentUserId = session.user.id;

  if (currentUserId === userId) {
    return { success: false, error: "Cannot follow yourself" };
  }

  const existing = await db.query.follows.findFirst({
    where: and(
      eq(follows.followerId, currentUserId),
      eq(follows.followingId, userId),
    ),
  });

  if (existing) {
    await db
      .delete(follows)
      .where(
        and(
          eq(follows.followerId, currentUserId),
          eq(follows.followingId, userId),
        ),
      );
    return { success: true, data: { following: false } };
  }

  await db.insert(follows).values({
    followerId: currentUserId,
    followingId: userId,
  });

  // Create notification
  await db.insert(notifications).values({
    recipientId: userId,
    senderId: currentUserId,
    type: "follow",
  });

  return { success: true, data: { following: true } };
}

export async function getFollowers(userId: string) {
  const session = await requireSession();
  const currentUserId = session.user.id;

  const results = await db
    .select({
      id: user.id,
      name: user.name,
      username: user.username,
      image: user.image,
      bio: user.bio,
      isFollowing: sql<boolean>`EXISTS(
        SELECT 1 FROM follows
        WHERE follows.follower_id = ${currentUserId}
        AND follows.following_id = ${user.id}
      )`,
    })
    .from(follows)
    .innerJoin(user, eq(follows.followerId, user.id))
    .where(eq(follows.followingId, userId))
    .orderBy(desc(follows.createdAt));

  return results.map((r) => ({
    ...r,
    isFollowing: Boolean(r.isFollowing),
  }));
}

export async function getFollowing(userId: string) {
  const session = await requireSession();
  const currentUserId = session.user.id;

  const results = await db
    .select({
      id: user.id,
      name: user.name,
      username: user.username,
      image: user.image,
      bio: user.bio,
      isFollowing: sql<boolean>`EXISTS(
        SELECT 1 FROM follows
        WHERE follows.follower_id = ${currentUserId}
        AND follows.following_id = ${user.id}
      )`,
    })
    .from(follows)
    .innerJoin(user, eq(follows.followingId, user.id))
    .where(eq(follows.followerId, userId))
    .orderBy(desc(follows.createdAt));

  return results.map((r) => ({
    ...r,
    isFollowing: Boolean(r.isFollowing),
  }));
}
