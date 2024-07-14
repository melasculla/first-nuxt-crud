import { del } from "@vercel/blob";

export default defineEventHandler(async event => {
   const urls = await readBody(event) as string[]
   if (!urls)
      createError({ statusCode: 400, statusMessage: 'Bad Request' })

   try {
      for (const image of urls) {
         await del(image)
      }
      return true
   } catch (err: any) {
      throw createError({ statusCode: err.status, statusMessage: err.message })
   }
})