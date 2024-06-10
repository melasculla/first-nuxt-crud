<template>
   <div class="bg-emerald-400 py-14 text-center h-5/6 flex items-center justify-center">
      <div v-if="posts?.length" class="grid grid-cols-2 md:grid-cols-4 px-4 gap-4">
         <div v-for="post in posts" :key="post.id">
            <NuxtLink :to="`/posts/${post.id}`" class="block max-w-max text-xl font-bold font-mono hover:bg-white hover:text-black
         hover:border-black transition-colors mx-auto rounded-md first-letter:capitalize">
               {{ post.title }}
               <img :src="post.thumbnail!">
            </NuxtLink>
         </div>
      </div>
      <div v-else class="text-3xl uppercase tracking-wider">
         <p class="animate-bounce">posts don't exist</p>
      </div>
   </div>
</template>

<script setup lang="ts">
const { data: posts } = await useFetch('/api/posts')
</script>

<style scoped></style>