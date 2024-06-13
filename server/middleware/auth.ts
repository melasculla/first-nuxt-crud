export default defineEventHandler(async event => {
   event.context.accessExpires = 60 * 10        // 10 mins
   event.context.refreshExpires = 60 * 60 * 3   // 3 hour

   const accessToken = getCookie(event, 'auth')

   const isVerified = accessToken ?
      await verifyAccessToken(event, accessToken) :
      await verifyRefreshToken(event)

   const protectedRoutes: string[] = [
      '/api/logout',
      '/api/user/',
   ]
   const isProtectedRoute = protectedRoutes.find(route => event.path.includes(route))

   if (!isVerified && isProtectedRoute) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
   }
})