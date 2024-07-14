<template>
   <div class="bg-emerald-400 p-5 h-5/6 flex items-center justify-center">
      <PostEditor class="w-full" />
   </div>
</template>

<script setup lang="ts">
definePageMeta({
   middleware: ['auth-require']
})
</script>