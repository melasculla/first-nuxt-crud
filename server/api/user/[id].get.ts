export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, "id")!);

  try {
    const { password, ...user } = await userModel().getUser(id);
    return user;
  } catch (err: any) {
    throw createError({ statusCode: 404, statusMessage: 'User not Found' })
  }

});