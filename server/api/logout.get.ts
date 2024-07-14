export default defineEventHandler(async (event) => {
   await useStorage('redis:tokens').removeItem(event.context.user.id)
   event.context.user = null
   event.context.loggedIn = false
   deleteCookie(event, 'auth')
   deleteCookie(event, 'refresh')
   return true
})