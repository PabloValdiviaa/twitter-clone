import { pgTable, text, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";
import { posts } from "./posts";

export const reposts = pgTable(
  "reposts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.postId] })],
);

export const repostsRelations = relations(reposts, ({ one }) => ({
  user: one(user, {
    fields: [reposts.userId],
    references: [user.id],
  }),
  post: one(posts, {
    fields: [reposts.postId],
    references: [posts.id],
  }),
}));
