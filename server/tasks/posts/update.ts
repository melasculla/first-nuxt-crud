export default defineTask({
   meta: {
      name: 'posts:update',
      description: 'Updating posts in redis from DB',
   },
   async run({ payload, context }) {
      const posts = await postModel().getPosts()
      const cachedPosts = await useStorage('redis:posts').getItem('postList') as Post[]
      const isListEqual = JSON.stringify(posts) === JSON.stringify(cachedPosts)

      if (isListEqual) {
         console.info('Posts Cache is Valid')
         return { result: 'Cache is Valid' };
      }

      await useStorage('redis:posts').setItem('postList', posts)
      console.info('Posts Cache was upated')
      return { result: 'Cache was upated' };
   },
})