import { eq } from "drizzle-orm";

export const postModel = () => {
  const getPosts = async (): Promise<Post[]> => {
    return db.select().from(posts)
  }

  const getPost = async (id: number): Promise<Post> => {
    const [Post] = await db.select().from(posts).where(eq(posts.id, id))
    return Post
  }

  const createPost = async (Post: NewPost): Promise<{id: number}> => {
    const [newPost] = await db.insert(posts).values(Post).returning({ id: posts.id });
    return newPost
  }

  const updatePost = async (id: number, title: string) => {
    return db.update(posts).set({ title }).where(eq(posts.id, id))
  }

  const deletePost = async (id: number) => {
    return db.delete(posts).where(eq(posts.id, id))
  }

  return { getPosts, getPost, createPost, updatePost, deletePost }
}