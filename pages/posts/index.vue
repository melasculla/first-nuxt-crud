<template>
   <div class="bg-emerald-400 py-14 text-center h-5/6 flex items-center justify-center">
      <template v-if="!pending">
         <div class="w-full grid grid-cols-2 md:grid-cols-4 px-4 gap-4" v-if="data?.length">
            <div v-for="post in data" :key="post.id">
               <button type="button" class="font-bold flex justify-center items-center gap-1 mb-1"
                  @click="toggleLike(post.id)">
                  <span class="text-sm">{{ post?.likes }}</span>
                  <svg v-if="post.isLiked" class="hover:text-red-600 size-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                     viewBox="0 0 48 48">
                     <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="4"
                        d="M44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326c1.194-.397 2.562-1.016 4.01-1.826M34.959 27l6.878 8.5m.001-8.5l-6.879 8.5" />
                  </svg>
                  <svg v-else class="text-red-600 hover:text-black size-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                     viewBox="0 0 48 48">
                     <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="4"
                        d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8" />
                  </svg>
               </button>
               <NuxtLink :to="`/posts/${post.id}`" class="block max-w-max text-xl font-bold font-mono hover:bg-white hover:text-black
               hover:border-black transition-colors mx-auto rounded-md first-letter:capitalize">
                  {{ post.title }}
                  <img :src="post.thumbnail!">
               </NuxtLink>
            </div>
         </div>
         <div v-else class="text-3xl uppercase tracking-wider w-full">
            <p class="animate-bounce">posts will appear soon..</p>
         </div>
      </template>
      <div v-else class="w-full grid grid-cols-2 md:grid-cols-4 px-4 gap-4">
         <div v-for="post in 12" :key="post" class="block w-full">
            <div class="w-10/12 h-8 mx-auto mb-4 bg-slate-500 rounded-md animate-pulse"></div>
            <div class="w-full h-[170px] bg-slate-500 rounded-md animate-pulse"></div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
const { data, pending, refresh } = await useFetch('/api/posts', { immediate: false, server: false })
const { loggedIn } = useAuth()
const router = useRouter()
const proccesingLike = ref<boolean>(false)

const toggleLike = async (postId: Post['id']) => {
   if (!loggedIn.value) return router.push('/login')
   const post = data.value?.find(({ id }) => id === postId)
   if (!post || proccesingLike.value) return

   proccesingLike.value = true
   if (post.isLiked) {
      await $fetch('/api/posts/like/' + postId, { method: 'DELETE' })
      post.likes! -= 1
   } else {
      await $fetch('/api/posts/like/' + postId, { method: 'POST' })
      post.likes! += 1
   }
   proccesingLike.value = false

   post.isLiked = !post.isLiked
}

onMounted(() => {
   refresh()
})
</script>

<style scoped></style>