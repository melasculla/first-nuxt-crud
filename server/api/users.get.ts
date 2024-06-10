export default defineEventHandler(async (event) => {
  return await userModel().getUsers();
});