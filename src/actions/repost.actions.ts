"use server";

import { db } from "@/lib/db";
import { reposts, notifications, posts } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth-session";
import { and, eq } from "drizzle-orm";
import type { ActionResult } from "@/types";

export async function toggleRepost(postId: string): Promise<ActionResult<{ reposted: boolean }>> {
  const session = await requireSession();
  const userId = session.user.id;

  const existing = await db.query.reposts.findFirst({
    where: and(eq(reposts.userId, userId), eq(reposts.postId, postId)),
  });

  if (existing) {
    await db
      .delete(reposts)
      .where(and(eq(reposts.userId, userId), eq(reposts.postId, postId)));
    return { success: true, data: { reposted: false } };
  }

  await db.insert(reposts).values({ userId, postId });

  // Create notification
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
    columns: { authorId: true },
  });
  if (post && post.authorId !== userId) {
    await db.insert(notifications).values({
      recipientId: post.authorId,
      senderId: userId,
      type: "repost",
      postId,
    });
  }

  return { success: true, data: { reposted: true } };
}
