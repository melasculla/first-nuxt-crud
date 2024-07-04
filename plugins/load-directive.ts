export default defineNuxtPlugin(nuxtApp => {
   const imageProps = {
      class: 'animate-spin',
      src: '/loader.svg',
      loading: 'lazy'
   }
   nuxtApp.vueApp.directive<HTMLImageElement>('loader', {
      created: (image, binding) => {
         const src = binding.value
         if (!src) return

         const setDefaultProps = () => {
            image.setAttribute('src', imageProps.src)
            image.setAttribute('data-src', binding.value)
            image.setAttribute('loading', 'lazy')
            image.classList.add('animate-spin')
         }
         const loadImage = () => {
            const img = new Image()
            img.onload = () => {
               image.after(img)
               image.classList.remove('animate-spin')
               image.removeAttribute('data-src')
               image.src = src
               img.remove()
            }
            img.src = src
            window.removeEventListener('load', loadImage)
         }

         if (!image.src) {
            setDefaultProps()
            loadImage()
            return
         }

         console.log('EventListener was added')

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