import { eq, and, count } from "drizzle-orm";

export const postModel = () => {
  const getPosts = async (): Promise<PostList> => {
    const postsList = await db.query.posts.findMany({
      columns: {
        id: true,
        title: true,
        thumbnail: true
      },
      orderBy: (posts, { desc }) => [ desc(posts.createdAt) ]
    })
    return postsList
  }

  const getPost = async (id: Post['id']): Promise<Post> => {
    const [post] = await db
      .select({
        ...posts as PostColumns,
        likes: count(usersToPosts.userId),
      })
      .from(posts)
      .where(eq(posts.id, id))
      .leftJoin(usersToPosts, eq(posts.id, usersToPosts.postId))
      .groupBy(posts.id)
      .orderBy(posts.id)

    return post
  }

  const likePost = async (postId: Post['id'], userId: User['id']): Promise<Post['id']> => {
    const [likedPost] = await db.insert(usersToPosts).values({ postId, userId }).returning({ id: usersToPosts.postId })
    return likedPost.id
  }

  const createPost = async (post: NewPost): Promise<{ id: number }> => {
    const [newPost] = await db.insert(posts).values(post).returning({ id: posts.id })
    return newPost
  }

  const updatePost = async (post: Post) => {
    const [updatedPost] = await db.update(posts).set(post).where(eq(posts.id, post.id)).returning({ id: posts.id })
    return updatedPost
  }

  const deletePost = async (id: Post['id']) => {
    return db.delete(posts).where(eq(posts.id, id))
  }

  const deleteLikedPost = async (postId: Post['id'], userId: User['id']): Promise<Post['id']> => {
    const [deletedLikedPost] = await db.delete(usersToPosts).where(and(eq(usersToPosts.postId, postId), eq(usersToPosts.userId, userId))).returning({ id: usersToPosts.postId })
    return deletedLikedPost.id
  }

  return { getPosts, getPost, likePost, createPost, updatePost, deletePost, deleteLikedPost }
}