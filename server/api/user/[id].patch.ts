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
  if (!updatedUser.id) return createError({ statusCode: 404, statusMessage: 'User not Found' })
  
  if (event.context.user.id === id) {
    await createToken(event, { id, name: newName, role: updatedUser.role }, event.context.accessExpires, 'auth')
  }

  return updatedUser;
});