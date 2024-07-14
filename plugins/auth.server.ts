export default defineNuxtPlugin(async nuxtApp => {
   const currentUser = await useRequestEvent()?.context.user as UserWithoutPassword
   useState<UserWithoutPassword | null>('currentUser', () => {
      return currentUser || null
   })
})