import bcrypt from "bcrypt"

export default defineEventHandler(async (event) => {
   const { name, password } = await readBody(event) as { name: string, password: string};
   const lowerCaseName = name.toLowerCase()

   const user = (await userModel().getUserByName(lowerCaseName));
   if (!user) return createError({ statusCode: 404, statusMessage: 'User not Found' })

   const isPasswordsMatch = await bcrypt.compare(password, user.password!);

   if (!isPasswordsMatch) return createError({ statusCode: 403, statusMessage: 'Wrong password' })

   const publicUser = { name: user.name, id: user.id, role: user.role }

   await createToken(event, publicUser, event.context.accessExpires, 'auth')
   await createToken(event, { salt: (Math.random() * 1325), id: user.id }, event.context.refreshExpires, 'refresh')

   return {
      id: user.id,
      name: user.name,
      role: user.role
   }
});