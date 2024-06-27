<template>
   <div>
      <h2 class="text-xl" v-if="block.level === 2" v-html="block.text" />
      <h3 class="text-lg" v-else-if="block.level === 3" v-html="block.text" />
   </div>
</template>

<script setup lang="ts">
import type { OutputBlockData } from '@editorjs/editorjs';

const { block } = defineProps<{
   block: OutputBlockData['data']
}>()
</script>

<style scoped></style>