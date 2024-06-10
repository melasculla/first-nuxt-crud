export default defineEventHandler((event) => {
   if (!event.context.loggedIn) return createError({ statusCode: 403, statusMessage: 'Unauthorized' })
   createToken(event, event.context.user, event.context.accessExpires, 'auth')
   return 'Token Refreshed'
})