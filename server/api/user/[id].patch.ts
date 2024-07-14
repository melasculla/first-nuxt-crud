export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, "id")!);
  const body = await readBody(event);
  const newName = body.name;
  const newRole = body.role;

  const updatedUser = await userModel().updateUser({
    id,
    name: newName,
    role: newRole || 'user'
  });
  if (!updatedUser.id) throw createError({ statusCode: 404, statusMessage: 'User not Found' })

  // TODO: figure out what to do with token when name changes

  // if (event.context.user.id === id) {
  //   await createAccessToken(event, { id, name: newName, role: updatedUser.role })
  // }

  return updatedUser;
});