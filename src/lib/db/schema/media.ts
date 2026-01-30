import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { posts } from "./posts";

export const media = pgTable("media", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  type: varchar("type", { length: 10 }).notNull(), // 'image' | 'gif' | 'video'
  width: integer("width"),
  height: integer("height"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mediaRelations = relations(media, ({ one }) => ({
  post: one(posts, {
    fields: [media.postId],
    references: [posts.id],
  }),
}));
