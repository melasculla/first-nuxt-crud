<template>
   <div class="text-center text-white bg-emerald-400">
      <h2 class="py-4 text-4xl font-bold">Here u can upload some files</h2>
      <form @submit.prevent="handleSubmit" class="grid mx-auto text-center mt-4 justify-center justify-items-center"
         ref="form">
         <label for="upload"
            class="bg-yellow-400 outline-none rounded text-center cursor-pointer leading-none text-2xl px-6 py-2 font-black active:bg-white active:text-fuchsia-600">Upload</label>
         <input id="upload" type="file" multiple @change="handleFiles" class="sr-only" accept=".jpg,.jpeg,.png,.webp">
         <div class="text-red-500 my-4" v-if="error">
            <p v-html="error"></p>
         </div>
         <div v-if="filesList" class="grid grid-cols-4 gap-4 px-8">
            <div v-for="(file, index) in filesList" :key="index" class="grid content-between">
               <div class="grid items-center justify-center mb-2">
                  <button type="button" class="text-red-600 text-2xl font-black"
                     @click="removeFile(file.name)">X</button>
                  <p class="max-w-[20ch] overflow-hidden">{{ (file.size / 1024 / 1024).toFixed(2) }} Mb</p>
               </div>
               <div class="h-[300px] w-full">
                  <img :src="file.preview" class="w-full h-full object-cover">
               </div>
            </div>
         </div>
         <button v-if="filesList?.length"
            class="my-6 mx-auto py-2 px-6 bg-cyan-500 uppercase font-bold rounded-lg w-max"
            :class="{ 'bg-slate-400': uploading }" :disabled="uploading ? true : false">{{
               uploading ? 'Uploading...' : 'Submit' }}</button>
         <div v-if="result.length">
            {{ result }}
         </div>
      </form>
   </div>
</template>

<script setup lang="ts">
definePageMeta({
   middleware: ['auth-require']
})

type FileWithPreview = File & { preview: string }

const filesList = ref<FileWithPreview[] | null>([])
const uploading = ref<boolean>(false)
const form = ref<HTMLFormElement>()
const error = ref<string>('')
const result = ref<string[]>([])


const removeFile = (removeName: string) => {
   filesList.value = filesList.value?.filter(({ name }) => {
      return name !== removeName
   }) as FileWithPreview[]
}

const handleFiles = (e: Event) => {
   const filesInput = (e.target as HTMLInputElement).files! as FileList
   error.value = ''
   result.value = []

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
   }
}

const resetForm = () => {
   uploading.value = false
   filesList.value = null
   form.value?.reset()
}

const handleSubmit = async (e: Event) => {
   error.value = ''
   if (!filesList.value?.length || uploading.value) return

   const body = new FormData()

   for (const file of filesList.value) {
      body.append('files', file)
   }

   try {
      uploading.value = true
      const data = await $fetch('/api/images/upload', {
         method: 'POST',
         body
      })
      result.value = data
      resetForm()
   } catch (err: any) {
      console.warn(err)
   }
}
</script>

<style scoped></style>