import { put } from "@vercel/blob";

export default defineEventHandler(async event => {
   const formData = await readMultipartFormData(event)
   if (!formData) throw createError({ statusCode: 400, statusMessage: 'Invalid File(s)' })

   let result: string[] = []

   for (const { filename, data } of formData) {
      const isAllowedSize = data.length <= 1024 * 1024 * 3 // 3 Mb
      if (!isAllowedSize) continue

      try {
         const { url } = await put('images/' + filename!, data, { access: 'public' })
         result.push(url)
      } catch (error: any) {
         throw createError({ statusCode: error.status, statusMessage: error.message })
      }
   }

   return result
})