<template>
   <div>
      <img :src="block.file.url" :alt="block.caption" :title="block.caption" class="border-orange-400"
         :class="block.withBorder ? 'border-2' : '' + block.stretched ? 'w-full' : '' + block.withBackground ? 'bg-red-600' : ''" />
   </div>
</template>

<script setup lang="ts">
import type { OutputBlockData } from '@editorjs/editorjs';

const { block } = defineProps<{
   block: OutputBlockData['data']
}>()
</script>

<style scoped></style>