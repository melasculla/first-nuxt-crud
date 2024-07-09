<template>
   <div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 items-center">
         <div v-for="image in data" :key="image.path">
            <NuxtImg :src="image.path" placeholder="/loader.svg" placeholder-class="nuxtImage-loading" :alt="image.alt"
               loading="lazy" />
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
const { data } = defineProps<{
   data: Gallery
}>()
</script>

<style scoped></style>