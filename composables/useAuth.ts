export const useAuth = () => {
   const user = useState<User | null>('currentUser');
   const loggedIn = computed(() => user.value !== null);
   const sessionNotification = useState<boolean>('sessionNotification', () => false)

   const signup = async (name: string, password: string) => {
      try {
         const createdUser = await $fetch('/api/signup', {
            method: 'post',
            body: { name, password }
         })
         await login(name, password)
      } catch (error: any) {
         throw createError({ statusCode: error.statusCode, statusMessage: error.message })
      }
   }

   const login = async (name: string, password: string) => {
      try {
         const data = await $fetch('/api/login', {
            method: 'post',
            body: { name, password }
         })

         user.value = data as User

         return data
      } catch (error: any) {
         throw createError({ statusCode: error.statusCode, statusMessage: error.message })
      }
   }

   const logout = async () => {
      if (!loggedIn.value) return
      const router = useRouter()

      try {
         await $fetch('/api/logout')
         user.value = null
         router.push('/')
      } catch (error) {
         console.warn('Failed to logout: ', error)
      }
   }

   const checkAuthCookie = async () => {
      const accessToken = useCookie('auth')
      const refreshToken = useCookie('refresh')
      if (accessToken.value || refreshToken.value) return

      if (user.value) renderNotification()
      user.value = null
   }

   const renderNotification = () => {
      sessionNotification.value = true
      setTimeout(() => {
         sessionNotification.value = false
      }, 4000);
   }

   return { loggedIn, user, signup, login, logout, checkAuthCookie }
}