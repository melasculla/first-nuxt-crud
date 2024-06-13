<template>
   <div class="grid mx-auto text-center justify-center justify-items-center">
      <div v-if="multiple ? true : !filesList?.length">
         <label for="upload"
            class="block bg-yellow-400 outline-none rounded text-center cursor-pointer text-lg px-6 py-2 text-white font-black active:bg-white active:text-fuchsia-600">
            {{ title }}
         </label>
         <input id="upload" type="file" :multiple="multiple ? true : false" @change="handleFiles" class="sr-only"
            accept=".jpg,.jpeg,.png,.webp">
      </div>
      <div class="text-red-500 my-4" v-if="error">
         <p v-html="error"></p>
      </div>
      <div v-if="filesList" class="grid gap-4 px-8" :class="multiple ? 'grid-cols-4' : ''">
         <div v-for="file in filesList" :key="file.name" class="grid justify-items-center content-between">
            <div class="flex justify-between items-center mb-2 gap-4">
               <!-- <p class="max-w-[20ch] text-base overflow-hidden">{{ (file.size / 1024 / 1024).toFixed(2) }} Mb</p> -->
               <p class="max-w-full text-base overflow-hidden">{{ file.name }} </p>
               <button type="button" class="text-red-600 justify-self-end" @click="removeFile(file.name)">
                  <svg class="size-8" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="7 7 10 10">
                     <path fill="currentColor"
                        d="m8.054 16.673l-.727-.727L11.273 12L7.327 8.079l.727-.727L12 11.298l3.921-3.946l.727.727L12.702 12l3.946 3.946l-.727.727L12 12.727z" />
                  </svg>
               </button>
            </div>
            <div class="w-full" :class="multiple ? `h-[300px]` : `max-w-[400px]`">
               <img :src="file.preview" class="w-full h-full object-cover">
            </div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
type FileWithPreview = File & { preview: string }

const $emit = defineEmits(['imagesAdded']);
const { multiple, title } = defineProps<{
   title: string
   multiple: boolean
}>()

const filesList = ref<FileWithPreview[] | null>([])
const error = ref<string>('')

const handleFiles = (e: Event) => {
   const filesInput = (e.target as HTMLInputElement).files! as FileList
   error.value = ''

   for (let file of filesInput) {
      let tempFile = file as FileWithPreview

      const isFileExists = filesList.value?.find(({ name, size }) => (tempFile.name === name && tempFile.size === size))
      const isSupportedFormat = tempFile.type.includes('image')
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
      
      tempFile.preview = URL.createObjectURL(file)
      filesList.value!.push(tempFile)
      if (!multiple) break
   }
   $emit('imagesAdded', filesList.value)
}

const removeFile = (removeName: string) => {
   filesList.value = filesList.value?.filter(({ name }) => name !== removeName) as FileWithPreview[]
}
</script>

<style scoped></style>