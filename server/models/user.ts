import { eq } from "drizzle-orm";

export const userModel = () => {
  const getUsers = async (): Promise<User[]> => {
    return db.select().from(users)
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
    const [newUser] = await db.insert(users).values(user).returning({ id: users.id, name: users.name });
    return newUser
  }

  const updateUser = async (id: number, name: string, role?: Roles) => {
    const [updatedUser] = await db.update(users)
      .set({ name, role })
      .where(eq(users.id, id))
      .returning({ id: users.id, name: users.name, role: users.role });
    return updatedUser
  }

  const deleteUser = async (id: number) => {
    return db.delete(users).where(eq(users.id, id))
  }

  return { getUsers, getUser, getUserByName, createUser, updateUser, deleteUser }
}