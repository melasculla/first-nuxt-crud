export const useAuth = () => {
   const token = useCookie('auth');
   const refreshCookieToken = useCookie('refresh');
   const user = useState<User | null>('currentUser');
   const loggedIn = computed(() => user.value !== null);

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

   const refreshToken = async () => {
      try {
         await $fetch('/api/refreshToken')
      } catch (error) {
         console.warn('Failed to refresh token: ', error)
      }
   }

   const checkAuthCookie = async () => {
      if (token.value && refreshCookieToken.value) return
      if (refreshCookieToken.value) {
         try {
            await refreshToken()
            return
         } catch (error: any) { }
      }
      user.value = null
   }

   return { loggedIn, user, signup, login, logout, checkAuthCookie }
}