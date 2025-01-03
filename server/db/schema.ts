import { pgTable, text, varchar, integer, timestamp, primaryKey, serial, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { OutputData } from '@editorjs/editorjs';

export const users = pgTable('users', {
   id: serial('id').primaryKey(),
   name: varchar('name', { length: 256 }).notNull().unique(),
   password: varchar('password', { length: 256 }).notNull(),
   role: varchar('role', { length: 20 }).$type<Roles>().notNull().default('user'),
});

export type Roles = 'user' | 'admin'
export type User = typeof users.$inferSelect & { likedPosts?: Post['id'][] }; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type
export type UserColumns = typeof users._.columns;
export type UserWithoutPassword = Omit<User, 'password'>

export const posts = pgTable('posts', {
   id: serial('id').primaryKey(),
   title: text('title').notNull(),
   content: json('content').$type<OutputData>(),
   gallery: json('gallery').$type<Gallery>(),
   thumbnail: varchar('thumbnail', { length: 256 }),
   createdAt: timestamp('createdAt').notNull().defaultNow()
});


export type Post = typeof posts.$inferSelect & { likes?: number, isLiked?: boolean }; // return type when queried
export type PostList = Omit<Post, 'content' | 'gallery' | 'createdAt'>[]
export type NewPost = typeof posts.$inferInsert; // insert type
export type Gallery = { path: string, alt?: string }[]
export type PostColumns = typeof posts._.columns;


export const usersToPosts = pgTable('users_to_posts', {
   userId: integer('user_id').notNull().references(() => users.id),
   postId: integer('post_id').notNull().references(() => posts.id),
},
   (t) => ({
      pk: primaryKey({ columns: [t.userId, t.postId] }),
   }),
);

export const usersRelations = relations(users, ({ many }) => ({
   usersToPosts: many(usersToPosts),
}));

export const postsRelations = relations(posts, ({ many }) => ({
   usersToPosts: many(usersToPosts),
}));

export const usersToPostsRelations = relations(usersToPosts, ({ one }) => ({
   user: one(users, {
      fields: [usersToPosts.userId],
      references: [users.id],
   }),
   post: one(posts, {
      fields: [usersToPosts.postId],
      references: [posts.id],
   }),
}));