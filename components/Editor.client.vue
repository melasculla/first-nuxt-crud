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
import CheckList from '@editorjs/checklist'
import Underline from '@editorjs/underline'
// import IndentTuneTool from 'editorjs-indent-tune'
import AlignmentTuneTool from 'editorjs-text-alignment-blocktune'
import DragAndDrop from 'editorjs-drag-drop'
import Columns from '@calumk/editorjs-columns'
import ColorTool from 'editorjs-text-color-plugin'

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

const editor = ref<EditorJS>()
onMounted(() => {
   const tools = {
      header: {
         class: Header,
         inlineToolbar: true,
         config: {
            placeholder: 'Enter a header',
            levels: [2, 3],
            defaultLevel: 2,
         },
         tunes: ['AligmentTune']
      },
      paragraph: {
         tunes: ['AligmentTune']
      },
      list: {
         class: List,
         inlineToolbar: true
      },
      checklist: {
         class: CheckList,
         inlineToolbar: true,
      },
      underline: Underline,
      Color: {
         class: ColorTool,
         config: {
            customPicker: true
         }
      },
      Marker: {
         class: ColorTool,
         config: {
            defaultColor: '#FFBF00',
            type: 'marker',
            icon: `<svg fill="#000000" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.6,6L6.9,16.7c-0.2,0.2-0.3,0.4-0.3,0.6L6,23.9c0,0.3,0.1,0.6,0.3,0.8C6.5,24.9,6.7,25,7,25c0,0,0.1,0,0.1,0l6.6-0.6 c0.2,0,0.5-0.1,0.6-0.3L25,13.4L17.6,6z"></path> <path d="M26.4,12l1.4-1.4c1.2-1.2,1.1-3.1-0.1-4.3l-3-3c-0.6-0.6-1.3-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9L19,4.6L26.4,12z"></path> </g> <g> <path d="M28,29H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S28.6,29,28,29z"></path> </g> </g></svg>`
         }
      },
      image: {
         class: Image,
         inlineToolbar: true,
         config: {
            uploader: {
               uploadByFile
            }
         }
      },
      quote: {
         class: Quote,
         inlineToolbar: true
      },
      embed: {
         class: Embed,
         config: {
            services: {
               youtube: true,
               instagram: true,
               pinterest: true,
               twitter: true,
               facebook: true
            }
         }
      },
      AligmentTune: {
         class: AlignmentTuneTool,
         config: {
            default: "left",
            blocks: {
               header: 'center',
            }
         },
      }
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

   editor.value = new EditorJS({
      tools: mainTools,
      onReady: () => {
         new DragAndDrop(editor.value)
      }
   })
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

const result = ref()
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