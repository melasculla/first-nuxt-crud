<template>
   <div class="w-full">
      <div id="editorjs" class="border-4 border-blue-500 bg-white"></div>
   </div>
</template>

<script setup lang="ts">
import EditorJS, { type OutputBlockData } from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Embed from '@editorjs/embed'
import Image from '@editorjs/image'
import Quote from '@editorjs/quote'
import Columns from '@calumk/editorjs-columns'


const uploadByFile = (file: File) => {
   const preview = URL.createObjectURL(file)
   const isAllowedSize = file.size <= 1024 * 1024 * 3 // 3 Mb

   if (!isAllowedSize) return new Promise(resolve => resolve({
      success: 0
   }))

   return new Promise(resolve => resolve({
      success: 1,
      file: {
         url: preview,
         file
      }
   }))
}

const tools = {
   header: {
      class: Header,
      inlineToolbar: true,
      config: {
         placeholder: 'Enter a header',
         levels: [2, 3],
         defaultLevel: 2
      }
   },
   list: {
      class: List,
      inlineToolbar: true
   },
   embed: {
      class: Embed
   },
   image: {
      class: Image,
      inlineToolbar: true,
      config: {
         // endpoints: {
         //    byFile: '/api/images/upload', // Your backend file uploader endpoint
         //    // byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
         // }
         uploader: {
            uploadByFile
         }
      }
   },
   quote: {
      class: Quote,
      inlineToolbar: true
   },
}
const mainTools: any = {
   ...tools,
   columns: {
      class: Columns,
      config: {
         EditorJsLibrary: EditorJS,
         tools
      }
   },
}

const editor = ref<EditorJS>()
onMounted(() => {
   editor.value = new EditorJS({ tools: mainTools })
})


const uploadImages = async (editorOutput: OutputBlockData['data'], images: File[]) => {
   const body = new FormData()
   for (const image of images) {
      body.append('images', image)
   }
   const urls = await $fetch('/api/images/upload', {
      method: 'POST',
      body
   })

   await findImages(editorOutput, true, urls)
}

const findImages = async (editorOutput: OutputBlockData['data'], replace: boolean = false, urls: string[] = []) => {
   if (replace && !urls.length) return

   let toUpload: File[] = []
   let count: number = 0
   for (const { data, type } of editorOutput.blocks) {
      if (type === 'columns') {
         for (const { blocks: colBlocks } of data.cols) {
            for (const { data: colData, type: colType } of colBlocks) {
               if (colType !== 'image') continue
               if (!replace) {
                  toUpload.push(colData.file.file)
                  continue
               }
               colData.file.url = urls[count]
               delete colData.file.file
               count++
            }
         }
      }
      if (type !== 'image') continue
      if (!replace) {
         toUpload.push(data.file.file)
         continue
      }
      data.file.url = urls[count]
      delete data.file.file
      count++
   };

   if (replace) return
   await uploadImages(editorOutput, toUpload)
}

const save = async () => {
   const editorOutput = await editor.value?.save()

   await findImages(editorOutput)

   return editorOutput
}

defineExpose({ save })
</script>

<style scoped lang="postcss">
:deep(.ce-editorjsColumns_col) {
   border: 1px solid #000;
}

:deep(h2) {
   @apply text-xl
}

:deep(h3) {
   @apply text-lg
}

:deep(.ce-paragraph) {
   @apply text-base
}
</style>