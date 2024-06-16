export default defineEventHandler(async event => {
   const id = parseInt(getRouterParam(event, "id")!);

   const post = await postModel().getPost(id);
   if (!post) throw createError({ statusCode: 404, statusMessage: 'Post not Found' })

   if (event.context.loggedIn) {
      const currentLikes: User['likedPosts'] = await event.$fetch('/api/posts/like/current')
      post.isLiked = currentLikes?.includes(post.id)
   }

   return post
})