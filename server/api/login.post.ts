import bcrypt from "bcrypt"

export default defineEventHandler(async (event) => {
   if (event.context.loggedIn) throw createError({ statusCode: 401, statusMessage: 'Already Authorized' })

   const { name, password } = await readBody(event) as { name: string, password: string };
   const lowerCaseName = name.toLowerCase()

   const { password: userPassword, ...user } = await userModel().getUserByName(lowerCaseName);
   if (!user) throw createError({ statusCode: 404, statusMessage: 'User not Found' })

   const isPasswordsMatch = await bcrypt.compare(password, userPassword);

   if (!isPasswordsMatch) throw createError({ statusCode: 403, statusMessage: 'Wrong password' })

   const isTokensCreated =
      await createAccessToken(event, user) &&
      await createRefreshToken(event, user)

   if (!isTokensCreated) throw createError({ statusCode: 500, statusMessage: 'Tokens doesn\'t created' })

   return user
});