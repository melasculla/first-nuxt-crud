export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, "id")!);

   if (event.context.user.id !== id)
      throw createError({ statusCode: 403, statusMessage: 'Cannot remove other users' })
   
   const deletedUser = await userModel().deleteUser(id);
   if (!deletedUser)
      throw createError({ statusCode: 404, statusMessage: 'User not Found' })

   await event.$fetch('/api/logout')

   return deletedUser;
});