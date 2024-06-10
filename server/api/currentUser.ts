export default defineEventHandler(async event => {
   return event.context.user || createError({ statusCode: 401, statusMessage: 'Unauthorized' })
})