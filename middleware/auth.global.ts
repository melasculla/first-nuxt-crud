export default defineNuxtRouteMiddleware(async (to, from) => {
   if (import.meta.client) {
      window.scrollTo(0, 0)
      await useAuth().checkAuthCookie()
   }
})