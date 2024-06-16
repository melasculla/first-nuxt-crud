export default defineEventHandler(async (event) => {
   const posts = await postModel().getPosts()

   if (event.context.loggedIn) {
      const currentLikes: User['likedPosts'] = await event.$fetch('/api/posts/like/current')
      posts.forEach(post => {
         post.isLiked = currentLikes?.includes(post.id)
         return post
      })
   }

   return posts
})