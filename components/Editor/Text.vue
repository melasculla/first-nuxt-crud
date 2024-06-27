<template>
   <div>
      <p class="text-base" v-html="block.text" />
   </div>
</template>

<script setup lang="ts">
import type { OutputBlockData } from '@editorjs/editorjs';

const { block } = defineProps<{
   block: OutputBlockData['data']
}>()
</script>

<style scoped></style>