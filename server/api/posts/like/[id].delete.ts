export default defineEventHandler(async event => {
   const postId = parseInt(getRouterParam(event, "id")!);
   if (!postId) throw createError({ statusCode: 400, statusMessage: 'Bad Request' })

   try {
      return await postModel().deleteLikedPost(postId, event.context.user.id)
   } catch (err: any) {
      console.warn(err.message)
      throw createError({ statusCode: err.status })
   }
})