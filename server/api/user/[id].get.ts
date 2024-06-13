export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, "id")!);

  const { password, ...user } = await userModel().getUser(id);
  if (!user) throw createError({ statusCode: 404, statusMessage: 'User not Found' })

  return user;
});