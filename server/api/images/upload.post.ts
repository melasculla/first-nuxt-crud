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
      } catch (err: any) {
         throw createError({ statusCode: err.status, statusMessage: err.message })
      }
   }
 
   try {
      const newPost = await postModel().createPost({
         title: 'test',
         thumbnail: result[0]
      })
      console.log(newPost)
   } catch (err: any) {
      throw createError({ statusCode: err.status, statusMessage: err.message })
   }

   return result
})