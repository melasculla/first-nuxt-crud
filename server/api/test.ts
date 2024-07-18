export default defineEventHandler(async (event) => {
   const { image } = getQuery(event) as { image: string };
 
   setHeader(event, 'content-type', 'image/jpeg');
   return await useStorage('images').getItemRaw(image);
 });
 