export default defineNuxtRouteMiddleware(async (to, from) => {
   if (import.meta.client) {
      await useAuth().checkAuthCookie()
   }
})