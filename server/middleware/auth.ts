import type { HTTPMethod } from 'h3'

export default defineEventHandler(async event => {
   const accessToken = getCookie(event, 'auth')
   const refreshToken = getCookie(event, 'refresh')

   const isVerified = accessToken ?
      await verifyAccessToken(event, accessToken) :
      await verifyRefreshToken(event, refreshToken)

   interface Route {
      path: string
      allowedMethods: HTTPMethod[]
   }
   const protectedRoutes: Route[] = [
      {
         path: '/api/images',
         allowedMethods: ['GET']
      },
      {
         path: '/api/posts/create',
         allowedMethods: []
      },
      {
         path: '/api/posts/like',
         allowedMethods: []
      },
      {
         path: '/api/posts',
         allowedMethods: ['GET']
      },
      {
         path: '/api/logout',
         allowedMethods: ['GET']
      },
      {
         path: '/api/user/',
         allowedMethods: ['GET']
      },
   ]
   const isProtectedRoute = protectedRoutes.find(({ path, allowedMethods }): boolean => {
      const isProtectedPath = event.path.includes(path)
      const isAllowedMethod = allowedMethods.includes(event.method)
      return isProtectedPath && !isAllowedMethod
   })

   if (isProtectedRoute && !isVerified) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
})