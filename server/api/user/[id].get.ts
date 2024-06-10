export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, "id")!);

  const user = await userModel().getUser(id);
  if (!user) return createError({ statusCode: 404, statusMessage: 'User not Found' })

  return user;
});