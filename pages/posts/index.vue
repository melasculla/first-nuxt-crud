<template>
   <div class="bg-emerald-400 py-14 text-center h-5/6 flex items-center justify-center">
      <template v-if="!pending">
         <div class="w-full grid grid-cols-2 md:grid-cols-4 px-4 gap-4 items-start" v-if="data?.length">
            <div class="w-full h-full grid justify-stretch" v-for="post in data" :key="post.id">
               <button type="button" class="font-bold self-start flex justify-center items-center gap-1 mb-1"
                  @click="toggleLike(post.id)">
                  <template v-if="proccesingID === post.id ? false : true">
                     <svg v-if="post.isLiked" class="hover:text-red-600 size-5" xmlns="http://www.w3.org/2000/svg"
                        width="32" height="32" viewBox="0 0 48 48">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                           stroke-width="4"
                           d="M44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326c1.194-.397 2.562-1.016 4.01-1.826M34.959 27l6.878 8.5m.001-8.5l-6.879 8.5" />
                     </svg>
                     <svg v-else class="text-red-600 hover:text-black size-5" xmlns="http://www.w3.org/2000/svg"
                        width="32" height="32" viewBox="0 0 48 48">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                           stroke-width="4"
                           d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8" />
                     </svg>
                  </template>
                  <template v-else>
                     <img class="size-5 animate-spin" src="/loader.svg" alt="loading..">
                  </template>
               </button>
               <NuxtLink :to="`/posts/${post.id}`" class="w-full text-xl font-bold font-mono hover:bg-white hover:text-black
               hover:border-black transition-colors mx-auto rounded-md first-letter:capitalize grid">
                  <p class="self-start">{{ post.title }}</p>
                  <div class="overflow-hidden aspect-square w-full self-end">
                     <NuxtImg :src="post.thumbnail" loading="lazy" placeholder="/loader.svg" placeholder-class="nuxtImage-loading" class="w-full h-full object-cover" v-if="post.thumbnail" />
                     <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-full h-full align-middle" width="32"
                        height="32" viewBox="0 0 32 32">
                        <path fill="currentColor"
                           d="M30 3.414L28.586 2L2 28.586L3.414 30l2-2H26a2.003 2.003 0 0 0 2-2V5.414zM26 26H7.414l7.793-7.793l2.379 2.379a2 2 0 0 0 2.828 0L22 19l4 3.997zm0-5.832l-2.586-2.586a2 2 0 0 0-2.828 0L19 19.168l-2.377-2.377L26 7.414zM6 22v-3l5-4.997l1.373 1.374l1.416-1.416l-1.375-1.375a2 2 0 0 0-2.828 0L6 16.172V6h16V4H6a2 2 0 0 0-2 2v16z" />
                     </svg>
                  </div>
               </NuxtLink>
            </div>
         </div>
         <div v-else class="text-3xl uppercase tracking-wider w-full">
            <p class="animate-bounce">posts will appear soon..</p>
         </div>
      </template>
      <div v-else class="w-full grid grid-cols-2 md:grid-cols-4 px-4 gap-4">
         <div v-for="post in 12" :key="post" class="grid justify-items-center w-full">
            <button type="button" class="font-bold self-start flex justify-center items-center gap-1 mb-5">
               <img class="size-5 animate-spin" src="/loader.svg">
            </button>
            <div class="w-9/12 h-8 mx-auto mb-4 bg-slate-500 rounded-md animate-pulse"></div>
            <div class="w-11/12 h-8 mx-auto mb-4 bg-slate-500 rounded-md animate-pulse"></div>
            <div class="w-full h-[270px] bg-slate-500 rounded-md animate-pulse"></div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
const { data, pending } = await useLazyFetch('/api/posts')
const { loggedIn } = useAuth()
const router = useRouter()
const proccesingID = ref<number>(0)

const toggleLike = async (postId: Post['id']) => {
   if (!loggedIn.value) return router.push('/login')

   const post = data.value?.find(({ id }) => id === postId)
   if (!post || proccesingID.value !== 0) return

   proccesingID.value = postId
   if (post.isLiked) {
      await $fetch('/api/posts/like/' + postId, { method: 'DELETE' })
      post.likes! -= 1
   } else {
      await $fetch('/api/posts/like/' + postId, { method: 'POST' })
      post.likes! += 1
   }
   proccesingID.value = 0

   post.isLiked = !post.isLiked
}
</script>

<style scoped></style>