export default defineNuxtPlugin(nuxtApp => {
   const imageProps = {
      class: 'animate-spin',
      src: '/loader.svg',
      loading: 'lazy'
   }
   nuxtApp.vueApp.directive<HTMLImageElement>('loader', {
      beforeMount: (image, binding) => {
         console.log(binding.value)
         const src = binding.value
         if (!src) return

         const setDefaultProps = () => {
            image.setAttribute('src', imageProps.src)
            image.setAttribute('data-src', binding.value)
            image.setAttribute('loading', 'lazy')
            image.classList.add('animate-spin')
            console.log('set default props')
         }
         const loadImage = () => {
            const img = new Image()
            console.log('loading image..')
            img.onload = () => {
               image.after(img)
               image.classList.remove('animate-spin')
               image.removeAttribute('data-src')
               image.src = src
               img.remove()
               console.log('image loaded')
            }
            img.src = src
            window.removeEventListener('load', loadImage)
         }

         if (!image.src) {
            console.log('image has ssr src')
            setDefaultProps()
            loadImage()
            return
         }

         console.log('image hasnt ssr src')

         window.addEventListener('load', loadImage)
      },
      getSSRProps: (binding, vnode) => {
         return {
            'data-src': binding.value,
            ...imageProps
         }
      }
   })
})