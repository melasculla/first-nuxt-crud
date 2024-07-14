export default defineEventHandler(async event => {
   const postId = parseInt(getRouterParam(event, "id")!);
   if (!postId) throw createError({ statusCode: 400, statusMessage: 'Bad Request' })

   try {
      return await postModel().likePost(postId, event.context.user.id)
   } catch (err: any) {
      if (err.message.startsWith('duplicate'))
         return null // throw createError({ statusCode: 409, statusMessage: 'Already liked' })

      if (err.message.includes('violates foreign key'))
         throw createError({ statusCode: 404, statusMessage: 'Post not Found' })

      console.warn(err.message)
      throw createError({ statusCode: err.status })
   }
})