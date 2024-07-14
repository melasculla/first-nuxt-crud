export default defineEventHandler(async event => {
   const newPost = await readBody<NewPost>(event)
   if (!newPost) throw createError({ statusCode: 400, statusMessage: 'Bad Request' })

   try {
      const createdPostID = await postModel().createPost(newPost)
      await runTask('posts:update')
      return createdPostID
   } catch (error: any) {
      throw createError({ statusCode: error.status, statusMessage: error.message })
   }
})