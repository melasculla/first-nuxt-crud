export default defineEventHandler(async event => {
   const { image } = getQuery(event) as { image: string }
   if (!image && typeof image !== 'string')
      throw createError({ statusCode: 400, statusMessage: 'Bad Request' })

   const isValidFileName = (/\.(gif|jpe?g|tiff?|png|webp|jpeg|webp)$/i).test(image)
   if (!isValidFileName)
      throw createError({ statusCode: 400, statusMessage: 'Wrong Filename' })


   try {
      setHeader(event, 'content-type', 'image/jpeg')
      return await useStorage('images').getItemRaw(image as string) ?? createError({ statusCode: 404, statusMessage: 'Image not Found' })
   } catch (err: any) {
      return `Error ${err}`
   }
})