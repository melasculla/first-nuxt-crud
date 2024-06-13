import { eq } from "drizzle-orm";

export const userModel = () => {
  const getUsers = async (): Promise<Omit<User, 'password'>[]> => {
    return db.select({ id: users.id, name: users.name, role: users.role }).from(users)
  }

  const getUser = async (id: number): Promise<User> => {
    const [user] = await db.select().from(users).where(eq(users.id, id))
    return user
  }

  const getUserByName = async (name: string): Promise<User> => {
    const [user] = await db.select().from(users).where(eq(users.name, name))
    return user
  }

  const createUser = async (user: NewUser) => {
    const [newUser] = await db.insert(users).values(user).returning({ id: users.id, name: users.name, role: users.role });
    return newUser
  }

  const updateUser = async (user: Omit<User, 'password'>) => {
    const [updatedUser] = await db.update(users)
      .set({ name: user.name, role: user.role })
      .where(eq(users.id, user.id))
      .returning({ id: users.id, name: users.name, role: users.role });
    return updatedUser
  }

  const deleteUser = async (id: number) => {
    return db.delete(users).where(eq(users.id, id))
  }

  return { getUsers, getUser, getUserByName, createUser, updateUser, deleteUser }
}