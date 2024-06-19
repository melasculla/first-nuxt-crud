export default defineEventHandler(async (event) => {
   let posts: Post[] = []

   const postList = await useStorage('redis:posts').getItem('postList') as Post[]
   posts = postList || await postModel().getPosts()
   if (!postList) {
      await useStorage('redis:posts').setItem('postList', posts)
   }

   if (event.context.loggedIn) {
      const likes = await currentLikes(event.context.user.id) as User['likedPosts']
      posts.forEach(post => {
         post.isLiked = likes?.includes(post.id)
         return post
      })
   }

   return posts
})