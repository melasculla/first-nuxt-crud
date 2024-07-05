export default defineNuxtPlugin(nuxtApp => {
   nuxtApp.vueApp.directive<HTMLImageElement>('loader', {
      mounted: (image) => {
         const src = image.src
         if (!src) return
         image.classList.add('opacity-0', 'transition-opacity')

         if (image.complete) {
            return
         }
         image.onload = () => {
            image.classList.remove('opacity-0')
         }

      }
   })
})