export default defineEventHandler(async event => {
   const accessToken = getCookie(event, 'auth')
   const refreshToken = getCookie(event, 'refresh')

   const isVerified = accessToken ?
      await verifyAccessToken(event, accessToken) :
      await verifyRefreshToken(event, refreshToken)

   const protectedRoutes: string[] = [
      '/api/images/upload',
      '/api/posts/create',
      '/api/posts/like',
      '/api/logout',
      '/api/user/',
   ]
   const isProtectedRoute = protectedRoutes.find(route => event.path.includes(route))
   if (isProtectedRoute && !isVerified) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
})