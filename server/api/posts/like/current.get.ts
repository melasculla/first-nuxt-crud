export default defineEventHandler(async event => {
   if (!event.context.loggedIn) return null
   return await userModel().getUserLikes(event.context.user.id)
})