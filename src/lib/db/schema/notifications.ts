import { pgTable, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";
import { posts } from "./posts";

export const notifications = pgTable("notifications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  recipientId: text("recipient_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  senderId: text("sender_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 20 }).notNull(), // 'like' | 'repost' | 'reply' | 'follow' | 'mention'
  postId: text("post_id").references(() => posts.id, { onDelete: "cascade" }),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  recipient: one(user, {
    fields: [notifications.recipientId],
    references: [user.id],
    relationName: "recipient",
  }),
  sender: one(user, {
    fields: [notifications.senderId],
    references: [user.id],
    relationName: "sender",
  }),
  post: one(posts, {
    fields: [notifications.postId],
    references: [posts.id],
  }),
}));
