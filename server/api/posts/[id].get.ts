export default defineEventHandler(async event => {
  const id = parseInt(getRouterParam(event, "id")!);

  const post = await postModel().getPost(id);
  if (!post) throw createError({ statusCode: 404, statusMessage: 'Post not Found' })

  return post;
})