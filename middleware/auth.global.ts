export default defineNuxtRouteMiddleware(async (to, from) => {
   if (import.meta.server && to.path === '/') {
      console.warn('test', useRequestEvent()?.context.user)
   }
   if (import.meta.client) {
      await useAuth().checkAuthCookie()
   }
})