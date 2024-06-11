export default defineEventHandler(async (event) => {
   const cachedKeys = await useStorage('posts').getKeys()
   let cachedPosts: Post[] = []
   
   if (cachedKeys.length) {
     for (const user of cachedKeys) {
      try {
         const cachedUser = await useStorage<Post>('posts').getItem(user)
         cachedPosts.push(cachedUser!)
      } catch (err: any) { continue }
     }
     console.log('cached Posts')
     return cachedPosts
   }
 
   const posts = await postModel().getPosts()
   for (const post of posts) {
     useStorage('posts').setItem(post.id.toString()+'.json', post)
   }
   return posts;
});