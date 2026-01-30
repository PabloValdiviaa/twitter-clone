"use server";

import { db } from "@/lib/db";
import { notifications, user, posts } from "@/lib/db/schema";
import { requireSession } from "@/lib/auth-session";
import { eq, desc, lt, and, sql } from "drizzle-orm";
import type { NotificationWithDetails, CursorPaginationResult, ActionResult } from "@/types";

const NOTIFICATIONS_PER_PAGE = 20;

export async function getNotifications({
  cursor,
  filter = "all",
}: {
  cursor?: string;
  filter?: "all" | "mentions";
}): Promise<CursorPaginationResult<NotificationWithDetails>> {
  const session = await requireSession();
  const currentUserId = session.user.id;

  const conditions = [eq(notifications.recipientId, currentUserId)];

  if (filter === "mentions") {
    conditions.push(eq(notifications.type, "mention"));
  }

  if (cursor) {
    conditions.push(lt(notifications.createdAt, new Date(cursor)));
  }

  const results = await db
    .select({
      id: notifications.id,
      recipientId: notifications.recipientId,
      senderId: notifications.senderId,
      type: notifications.type,
      postId: notifications.postId,
      isRead: notifications.isRead,
      createdAt: notifications.createdAt,
      senderName: user.name,
      senderUsername: user.username,
      senderImage: user.image,
      postContent: posts.content,
    })
    .from(notifications)
    .innerJoin(user, eq(notifications.senderId, user.id))
    .leftJoin(posts, eq(notifications.postId, posts.id))
    .where(and(...conditions))
    .orderBy(desc(notifications.createdAt))
    .limit(NOTIFICATIONS_PER_PAGE + 1);

  const hasMore = results.length > NOTIFICATIONS_PER_PAGE;
  const data = results.slice(0, NOTIFICATIONS_PER_PAGE).map((row) => ({
    id: row.id,
    recipientId: row.recipientId,
    senderId: row.senderId,
    type: row.type,
    postId: row.postId,
    isRead: row.isRead,
    createdAt: row.createdAt,
    sender: {
      id: row.senderId,
      name: row.senderName,
      username: row.senderUsername,
      image: row.senderImage,
    },
    post: row.postId && row.postContent
      ? { id: row.postId, content: row.postContent }
      : null,
  }));

  return {
    data,
    nextCursor: hasMore
      ? data[data.length - 1].createdAt.toISOString()
      : null,
  };
}

export async function markNotificationsAsRead(): Promise<ActionResult> {
  const session = await requireSession();

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(
      and(
        eq(notifications.recipientId, session.user.id),
        eq(notifications.isRead, false),
      ),
    );

  return { success: true, data: undefined };
}

export async function getUnreadCount(): Promise<number> {
  const session = await requireSession();

  const [result] = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(notifications)
    .where(
      and(
        eq(notifications.recipientId, session.user.id),
        eq(notifications.isRead, false),
      ),
    );

  return Number(result.count);
}
