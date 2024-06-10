export default defineEventHandler(async (event) => {
   event.context.loggedIn = false
   deleteCookie(event, 'auth')
   deleteCookie(event, 'refresh')
   return true
})