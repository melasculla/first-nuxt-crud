<template>
   <div>
      <ul :class="block.style === 'ordered' ? 'list-decimal' : 'list-disc'" class="pl-8">
         <li v-for="item in block.items" :key="item">
            <p class="text-base" v-html="item"></p>
         </li>
      </ul>
   </div>
</template>

<script setup lang="ts">
import type { OutputBlockData } from '@editorjs/editorjs';

const { block } = defineProps<{
   block: OutputBlockData['data']
}>()
</script>

<style scoped></style>