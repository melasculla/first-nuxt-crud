export default defineNuxtPlugin(async nuxtApp => {
   const currentUser = await useRequestEvent()?.context.user as Omit<User, 'password'>
   useState<Omit<User, 'password'> | null>('currentUser', () => {
      return currentUser || null
   })
})