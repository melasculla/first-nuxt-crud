import { eq, and } from "drizzle-orm";

export const userModel = () => {
  const getUsers = async (): Promise<UserWithoutPassword[]> => {
    const usersList = db.query.users.findMany({
      columns: {
        password: false
      }
    })
    return usersList
  }

  const getUser = async (id: number): Promise<User> => {
    const [user] = await db.select().from(users).where(eq(users.id, id))
    return user
  }

  const getUserByName = async (name: string): Promise<User> => {
    const [user] = await db.select().from(users).where(eq(users.name, name))
    return user
  }

  const getUserLikes = async (id: number): Promise<User['likedPosts']> => {
    const likes = await db.query.usersToPosts.findMany({
      where: eq(usersToPosts.userId, id),
      columns: {
        userId: false
      }
    })
    return likes.map(({ postId }) => postId)
  }

  const getUserLike = async (id: User['id'], pid: Post['id']): Promise<Post['id'] | undefined> => {
    const like = await db.query.usersToPosts.findFirst({
      where: and(eq(usersToPosts.postId, pid), eq(usersToPosts.userId, id)),
      columns: {
        userId: false
      }
    })
    return like?.postId
  }

  const createUser = async (user: NewUser) => {
    const [newUser] = await db.insert(users).values(user).returning({ id: users.id, name: users.name, role: users.role });
    return newUser
  }

  const updateUser = async (user: UserWithoutPassword) => {
    const [updatedUser] = await db.update(users)
      .set({ name: user.name, role: user.role })
      .where(eq(users.id, user.id))
      .returning({ id: users.id, name: users.name, role: users.role });
    return updatedUser
  }

  const deleteUser = async (id: number) => {
    return db.delete(users).where(eq(users.id, id))
  }

  return { getUsers, getUser, getUserLikes, getUserLike, getUserByName, createUser, updateUser, deleteUser }
}