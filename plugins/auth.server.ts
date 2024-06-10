export default defineNuxtPlugin(async () => {
   // await useAuth().loadUser(useRequestEvent()!)
   const currentUser = await useRequestEvent()?.context.user
   useState<User | null>('currentUser', () => {
      return currentUser || null
   })
})