export default defineNuxtRouteMiddleware(async (to, from) => {
   if (useAuth().loggedIn.value) return

   const desiredPath = useState<string | null>('desiredPath')
   desiredPath.value = to.path
   return navigateTo('/login')
})