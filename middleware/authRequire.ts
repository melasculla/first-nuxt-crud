export default defineNuxtRouteMiddleware(async (to, from) => {
   if (useAuth().loggedIn.value) return
   return navigateTo('/login')
})