export default defineEventHandler(async event => {
   const item = await useStorage('test').getItem('test')
   if (item) return item

   return await useStorage('test').setItem('test', 'clown')
})