export default defineEventHandler(async event => {
   const id = parseInt(getRouterParam(event, "id")!);

   const post = await postModel().getPost(id);
   if (!post) throw createError({ statusCode: 404, statusMessage: 'Post not Found' })

   if (event.context.loggedIn) {
      const isLiked = await currentLikes(event.context.user.id, id) as boolean
      post.isLiked = isLiked
   }

   return post
})