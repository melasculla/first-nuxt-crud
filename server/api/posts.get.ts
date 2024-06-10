export default defineEventHandler(async (event) => {
   return await postModel().getPosts();
});