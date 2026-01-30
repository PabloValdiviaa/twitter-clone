"use server";

import { db } from "@/lib/db";
import { likes, notifications } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth-session";
import { and, eq } from "drizzle-orm";
import type { ActionResult } from "@/types";
import { posts } from "@/lib/db/schema";

export async function toggleLike(postId: string): Promise<ActionResult<{ liked: boolean }>> {
  const session = await requireSession();
  const userId = session.user.id;

  const existing = await db.query.likes.findFirst({
    where: and(eq(likes.userId, userId), eq(likes.postId, postId)),
  });

  if (existing) {
    await db
      .delete(likes)
      .where(and(eq(likes.userId, userId), eq(likes.postId, postId)));
    return { success: true, data: { liked: false } };
  }

  await db.insert(likes).values({ userId, postId });

  // Create notification
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
    columns: { authorId: true },
  });
  if (post && post.authorId !== userId) {
    await db.insert(notifications).values({
      recipientId: post.authorId,
      senderId: userId,
      type: "like",
      postId,
    });
  }

  return { success: true, data: { liked: true } };
}
