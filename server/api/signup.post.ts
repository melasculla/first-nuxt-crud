import bcrypt from "bcrypt"

export default defineEventHandler(async (event) => {
  const { name, password } = await readBody(event);

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = await userModel().createUser({ name, password: hashedPassword });
    return newUser;
  } catch (error: any) {
    throw createError({ statusCode: error.status, statusMessage: error.message })
  }
});