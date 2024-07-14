<template>
   <div class="grid mx-auto text-center justify-center justify-items-center">
      <div v-if="multiple ? true : !images.length">
         <label :for="`upload-${multiple ? 'gallery' : 'thumbnail'}`"
            class="block bg-yellow-400 outline-none rounded text-center cursor-pointer text-lg px-6 py-2 text-white font-black active:bg-white active:text-fuchsia-600">
            {{ title }}
         </label>
         <input :id="`upload-${multiple ? 'gallery' : 'thumbnail'}`" type="file" :multiple="multiple ? true : false"
            @change="handleFiles" class="sr-only" accept=".jpg,.jpeg,.png,.webp">
      </div>
      <div class="text-red-500 my-4" v-if="error">
         <p v-html="error"></p>
      </div>
      <draggable class="grid gap-4 px-8 mt-4" :class="multiple ? 'grid-cols-4' : ''" v-model="images">
         <transition-group name="list">
            <div v-for="file, i in images" :key="i" class="grid justify-items-center content-between group relative">
               <input v-if="multiple" v-model="file.alt" placeholder="Enter Image Description"
                  class="w-11/12 bg-white px-1 p   y-2 rounded-md leading-none text-base absolute bottom-2 opacity-0 transition-opacity group-hover:opacity-100 z-10" />
               <div class="w-full relative group" :class="multiple ? `h-[300px]` : `max-w-[400px]`">
                  <button type="button"
                     class="absolute right-2 top-2 rounded-full bg-white/60 p-2 opacity-0 text-red-600 transition-opacity group-hover:opacity-100"
                     @click="removeFile(file.path)">
                     <svg class="size-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="7 7 10 10">
                        <path fill="currentColor"
                           d="m8.054 16.673l-.727-.727L11.273 12L7.327 8.079l.727-.727L12 11.298l3.921-3.946l.727.727L12.702 12l3.946 3.946l-.727.727L12 12.727z" />
                     </svg>
                  </button>
                  <img :src="file.path" class="w-full h-full object-cover">
               </div>
            </div>
         </transition-group>
      </draggable>
   </div>
</template>

<script setup lang="ts">
import { VueDraggableNext as draggable } from 'vue-draggable-next'

const { multiple, title, data, thumbnail } = defineProps<{
   title: string
   multiple: boolean
   data?: Gallery | null
   thumbnail?: string | null
}>()

const images = defineModel<(Gallery[0] & { file?: File })[]>({ default: [] })

if (data) {
   images.value = data
} else if (thumbnail) {
   images.value[0] = { path: thumbnail }
}


const filesToRemove = ref<string[]>([])
const error = ref<string>('')

const handleFiles = (e: Event) => {
   if (!multiple && images.value.length >= 1) return
   const filesInput = (e.target as HTMLInputElement).files! as FileList
   error.value = ''

   for (let file of filesInput) {
      const isFileExists = images.value.find(({ file: loopFile }) => (file.name === loopFile?.name && file.size === loopFile?.size))
      const isSupportedFormat = file.type.includes('image')
      const isAllowedSize = file.size <= 1024 * 1024 * 3 // 3 Mb
      const size = (file.size / 1024 / 1024).toFixed(2)

      if (isFileExists || !(isSupportedFormat && isAllowedSize)) {
         if (!isSupportedFormat) {
            error.value += `File ${file.name} have unsupported format ${file.type} (supported only images)<br>`
            continue
         }
         if (!isAllowedSize) error.value += `File ${file.name} too large: ${size} Mb (max size 3 Mb)<br>`
         if (isFileExists) error.value += `File ${file.name} already exists<br>`
         continue
      }

      const preview = URL.createObjectURL(file)
      images.value.push({ path: preview, file: file })

      if (!multiple) break
   }
}

const removeFile = (removePath: string) => {
   images.value = images.value.filter(({ path }) => path !== removePath)

   if (removePath.startsWith('blob:')) return
   filesToRemove.value.push(removePath)
}

defineExpose({ filesToRemove })
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
   transition: all 400ms ease;
}

.list-enter-from,
.list-leave-to {
   opacity: 0;
   transform: scale(0);
}

/* .list-leave-active {
   position: absolute;
} */
</style>