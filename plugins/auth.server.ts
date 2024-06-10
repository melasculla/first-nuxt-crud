export default defineNuxtPlugin(async () => {
   const currentUser = await useRequestEvent()?.context.user
   useState<User | null>('currentUser', () => {
      return currentUser || null
   })
})