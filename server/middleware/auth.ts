export default defineEventHandler(async event => {
   const token = getCookie(event, 'auth')
   const refreshToken = getCookie(event, 'refresh')
   event.context.accessExpires = 60 * 20 // @ 20 mins
   event.context.refreshExpires = 60 * 60 * 1 // @ 1 hour
   event.context.secret = '32478e2e-0de5-54c0-9bf7-85a53440d05c'

   if (token && refreshToken) {
      await verifyToken(event, token)
   } else if (refreshToken) {
      await verifyToken(event, refreshToken, true)
   } else if (token) {
      deleteCookie(event, 'auth')
   }
   console.warn(event.context.user, event.path)
   const protectedRoutes: string[] = [
      '/api/logout',
      '/api/user/',
   ]
   const isProtectedRoute = protectedRoutes.find(route => event.path.includes(route))

   if (!event.context.loggedIn && isProtectedRoute) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
   }
})