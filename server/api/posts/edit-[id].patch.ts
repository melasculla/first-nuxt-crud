export default defineEventHandler(async event => {
   const post = await readBody<Post>(event)
   if (!post) throw createError({ statusCode: 400, statusMessage: 'Bad Request' })

   try {
      await postModel().updatePost(post)
      await runTask('posts:update')
      return true
   } catch (error: any) {
      throw createError({ statusCode: error.status, statusMessage: error.message })
   }
})