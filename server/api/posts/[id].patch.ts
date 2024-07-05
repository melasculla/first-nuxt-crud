export default defineEventHandler(async event => {
   const post = await readBody<Post>(event)
   if (!post) throw createError({ statusCode: 400, statusMessage: 'Bad Request' })

   try {
      const { id } = await postModel().updatePost(post)
      await runTask('posts:update')
      return id
   } catch (error: any) {
      throw createError({ statusCode: error.status, statusMessage: error.message })
   }
})