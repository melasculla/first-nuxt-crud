export default defineEventHandler(async event => {
   const accessToken = getCookie(event, 'auth')
   const isVerified = accessToken ?
      await verifyAccessToken(event, accessToken) :
      await verifyRefreshToken(event)

   const protectedRoutes: string[] = [
      '/api/posts/create',
      '/api/images/upload',
      '/api/logout',
      '/api/user/',
   ]
   const isProtectedRoute = protectedRoutes.find(route => event.path.includes(route))

   if (!isVerified && isProtectedRoute) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
   }
})