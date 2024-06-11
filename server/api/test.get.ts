export default defineEventHandler(async event => {
   const now = new Date().getTime()
   const expiresIn = now + (1000 * 10) // 10 sec

   const keys = await useStorage('myCache:posts').getKeys()
   let cachedData: any[] = []
   if (keys.length) {
      for (const key of keys) {
         const data = await useStorage<any>('myCache:posts').getItem(key)
         const isExpired = now >= data.expiresIn

         if (!isExpired) {
            cachedData.push(data)
         }
      }
      if (cachedData.length) return {
         now,
         cachedData
      }
   }
   console.log('uncached data')

   const posts: any[] = await $fetch('https://art-studiott.com/wp-json/wp/v2/posts?_embed&per_page=40')
   posts.forEach(async (post) => {
      post.expiresIn = expiresIn
      await useStorage('myCache:posts').setItem(post.id + '.json', post)
   });
   return posts
})