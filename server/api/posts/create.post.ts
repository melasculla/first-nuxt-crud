export default defineEventHandler(async event => {
   const newPost = await readBody<NewPost>(event)
   if (!newPost) throw createError({ statusCode: 400, statusMessage: 'Bad Request' })

   try {
      const createdPost = await postModel().createPost(newPost)
      await runTask('posts:update')
      return true
   } catch (error: any) {
      throw createError({ statusCode: error.status, statusMessage: error.message })
   }
})