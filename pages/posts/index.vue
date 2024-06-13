<template>
   <div class="bg-emerald-400 py-14 text-center h-5/6 flex items-center justify-center">
      <div v-if="!pending" class="w-full grid grid-cols-2 md:grid-cols-4 px-4 gap-4">
         <div v-for="post in posts" :key="post.id" v-if="posts?.length">
            <NuxtLink :to="`/posts/${post.id}`" class="block max-w-max text-xl font-bold font-mono hover:bg-white hover:text-black
            hover:border-black transition-colors mx-auto rounded-md first-letter:capitalize">
               {{ post.title }}
               <img :src="post.thumbnail!">
            </NuxtLink>
         </div>
         <div v-else class="text-3xl uppercase tracking-wider">
            <p class="animate-bounce">posts will appear soon..</p>
         </div>
      </div>
      <div v-else class="w-full grid grid-cols-2 md:grid-cols-4 px-4 gap-4">
         <div v-for="post in 12" :key="post" class="block w-full">
            <div class="w-10/12 h-8 mx-auto mb-4 bg-slate-500 rounded-md animate-pulse"></div>
            <div class="w-full h-[170px] bg-slate-500 rounded-md animate-pulse"></div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
definePageMeta({
   middleware: [
      (to, from) => {
         const postsFrom = useState('postsFrom')
         postsFrom.value = null
         if (!from.path.includes('/posts/create')) return
         postsFrom.value = from.path
      }
   ]
})
const _from = useState<string | null>('postsFrom')

const { data: posts, pending, refresh } = await useFetch('/api/posts', { immediate: false })

if (_from.value) {
   refresh()
   _from.value = null
}

onMounted(() => {
   refresh()
})
</script>

<style scoped></style>