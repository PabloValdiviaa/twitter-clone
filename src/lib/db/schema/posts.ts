import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";
import { likes } from "./likes";
import { reposts } from "./reposts";
import { bookmarks } from "./bookmarks";
import { media } from "./media";

export const posts = pgTable("posts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  content: varchar("content", { length: 280 }).notNull(),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  parentId: text("parent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(user, {
    fields: [posts.authorId],
    references: [user.id],
  }),
  parent: one(posts, {
    fields: [posts.parentId],
    references: [posts.id],
    relationName: "replies",
  }),
  replies: many(posts, { relationName: "replies" }),
  likes: many(likes),
  reposts: many(reposts),
  bookmarks: many(bookmarks),
  media: many(media),
}));
