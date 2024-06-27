<template>
   <div class="grid gap-4">
      <div v-for="block in content.blocks" :key="block.id">
         <div v-if="block.type === 'columns'" class="grid gap-4 grid-cols-1 sm:grid-cols-2" :class="block.data.cols.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'">
            <div v-for="column, index in block.data.cols" :key="index">
               <div v-for="columnBlock in column.blocks" :key="columnBlock.id">
                  <EditorTitle v-if="columnBlock.type === 'header'" :block="columnBlock.data" />
                  <EditorText v-else-if="columnBlock.type === 'paragraph'" :block="columnBlock.data" />
                  <EditorImage v-else-if="columnBlock.type === 'image'" :block="columnBlock.data" />
               </div>
            </div>
         </div>
         <EditorTitle v-else-if="block.type === 'header'" :block="block.data" />
         <EditorText v-else-if="block.type === 'paragraph'" :block="block.data" />
         <EditorImage v-else-if="block.type === 'image'" :block="block.data" />
      </div>
   </div>
</template>

<script setup lang="ts">
import type { OutputData } from '@editorjs/editorjs';

const { content } = defineProps<{
   content: OutputData
}>()
</script>

<style scoped></style>